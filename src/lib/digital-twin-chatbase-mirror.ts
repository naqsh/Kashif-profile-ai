import type { NextRequest, NextResponse } from "next/server";
import {
  getChatbaseMonthlyBudget,
  getMonthKey,
  isMirrorBudgetExhausted,
  normalizeMirrorSnapshot,
  type ChatbaseMirrorSnapshot,
} from "@/lib/digital-twin-provider";
import {
  decodeSignedCookie,
  encodeSignedCookie,
} from "@/lib/signed-cookie";

export const CHATBASE_MIRROR_COOKIE_NAME = "dt_chatbase_global";

type MirrorPayload = {
  count: number;
  month: string;
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 35;

export function readMirrorPayload(
  request: NextRequest,
  month = getMonthKey(),
): MirrorPayload {
  const parsed = decodeSignedCookie<MirrorPayload>(
    request.cookies.get(CHATBASE_MIRROR_COOKIE_NAME)?.value,
  );

  if (!parsed || parsed.month !== month) {
    return { count: 0, month };
  }

  return { count: Math.max(0, parsed.count), month };
}

export function incrementMirrorPayload(
  current: MirrorPayload,
  month = getMonthKey(),
): MirrorPayload {
  if (current.month !== month) {
    return { count: 1, month };
  }
  return { count: current.count + 1, month };
}

export function toMirrorSnapshot(
  payload: MirrorPayload,
  budget = getChatbaseMonthlyBudget(),
): ChatbaseMirrorSnapshot {
  return normalizeMirrorSnapshot({
    used: payload.count,
    budget,
    month: payload.month,
  });
}

export function applyMirrorCookie(
  response: NextResponse,
  payload: MirrorPayload,
): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${CHATBASE_MIRROR_COOKIE_NAME}=${encodeSignedCookie(payload)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`,
  );
}

export function buildMirrorStatus(
  request: NextRequest,
): {
  mirror: ChatbaseMirrorSnapshot;
  shouldUseOpenRouter: boolean;
} {
  const payload = readMirrorPayload(request);
  const mirror = toMirrorSnapshot(payload);
  return {
    mirror,
    shouldUseOpenRouter: isMirrorBudgetExhausted(mirror),
  };
}
