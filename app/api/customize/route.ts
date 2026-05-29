import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "@/lib/workos";
import { hasLifetimeAccess } from "@/lib/entitlements";
import { getCustomization, saveCustomization } from "@/lib/customizations-repo";
import {
  CustomizeConfigInputSchema,
  MAX_CONFIG_BYTES,
  normalizeConfig,
} from "@/lib/customize-schema";

export const runtime = "nodejs";

async function gate() {
  const session = await withAuth();
  if (!session.user) {
    return { ok: false as const, res: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  }
  if (!(await hasLifetimeAccess(session.user.id))) {
    return { ok: false as const, res: NextResponse.json({ error: "no_entitlement" }, { status: 403 }) };
  }
  return { ok: true as const, userId: session.user.id };
}

export async function GET() {
  const g = await gate();
  if (!g.ok) return g.res;

  const config = await getCustomization(g.userId);
  return NextResponse.json({ config });
}

export async function PUT(request: NextRequest) {
  const g = await gate();
  if (!g.ok) return g.res;

  // Size guard before JSON parse to avoid loading huge payloads into memory.
  const cl = Number(request.headers.get("content-length") ?? "0");
  if (cl && cl > MAX_CONFIG_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = CustomizeConfigInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_shape" }, { status: 400 });
  }

  const config = normalizeConfig(parsed.data);
  await saveCustomization(g.userId, config);
  return NextResponse.json({ ok: true });
}
