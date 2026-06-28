import {
  apiSchemas,
  createApiAircraft,
  createApiAogRequest,
  getApiAdminOverview,
  getApiAircraft,
  getApiAogRequests,
  getApiCurrentUser,
  searchApiParts,
  updateApiAogStatus,
} from "@/lib/app.functions";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const aircraftInputSchema = z.object({
  registration: z.string().min(1),
  category: apiSchemas.aircraftCategory,
  makeModel: z.string().min(1),
  serialNumber: z.string().min(1),
  yearOfManufacture: z.string().min(1),
  typeOfOperations: z.string().min(1),
  ownerOperatorName: z.string().min(1),
  baseAirport: z.string().min(1),
  engineManufacturer: z.string().optional(),
  engineType: z.string().optional(),
  engineSeries: z.string().optional(),
  engineSerialNumbers: z.string().optional(),
  numberOfEngines: z.number().optional(),
  maintenanceProgramme: z.string().optional(),
  registryStandard: z.string().optional(),
  amoName: z.string().optional(),
  amoPhone: z.string().optional(),
  amoEmergencyPhone: z.string().optional(),
  picPhone: z.string().optional(),
  maintenancePoc: z.string().optional(),
  insurerName: z.string().optional(),
  insurerPolicyRef: z.string().optional(),
  totalAirframeHours: z.string().optional(),
  avionicsSuite: z.string().optional(),
  commonParts: z.array(z.string()).optional(),
  alternatePartNumbers: z.array(z.string()).optional(),
  supportNotes: z.string().optional(),
  plan: apiSchemas.plan,
});

const aogInputSchema = z.object({
  aircraftId: z.string().min(1),
  location: z.string().optional(),
  aircraftType: z.string().optional(),
  ataChapter: apiSchemas.ataChapter.optional(),
  affectedSystem: z.string().min(1),
  partNumber: z.string().optional(),
  issueDescription: z.string().min(1),
  urgency: apiSchemas.urgency,
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  attachments: z.array(z.string()).optional(),
});

const statusInputSchema = z.object({
  status: apiSchemas.status,
});

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

function notFound(path: string) {
  return json(
    {
      error: {
        code: "not_found",
        message: `No PlaneServe API route matched ${path}.`,
      },
    },
    { status: 404 },
  );
}

function validationError(error: z.ZodError) {
  return json(
    {
      error: {
        code: "validation_error",
        message: "Request body failed validation.",
        issues: error.issues,
      },
    },
    { status: 422 },
  );
}

function statusForError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (/authentication required|unauthorized|not authenticated/i.test(message)) return 401;
  if (/admin access required|access denied|forbidden/i.test(message)) return 403;
  if (/not found/i.test(message)) return 404;
  if (/select an aircraft|validation|invalid/i.test(message)) return 400;
  return 500;
}

function codeForStatus(status: number) {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 400) return "bad_request";
  return "server_error";
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function handleApiRequest(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/v1\/?/, "");
  const parts = path.split("/").filter(Boolean);
  const method = request.method.toUpperCase();

  try {
    if (method === "GET" && parts.length === 0) {
      return json({
        name: "PlaneServe API",
        version: "v1",
        status: "db-backed-local",
        endpoints: [
          "GET /api/v1/health",
          "GET /api/v1/me",
          "GET /api/v1/aircraft",
          "POST /api/v1/aircraft",
          "GET /api/v1/parts/search?q=&aircraftId=&registration=",
          "GET /api/v1/aog-requests",
          "POST /api/v1/aog-requests",
          "PATCH /api/v1/aog-requests/:id/status",
          "GET /api/v1/admin/overview",
        ],
      });
    }

    if (method === "GET" && parts[0] === "health") {
      return json({ ok: true, service: "planeserve-api", version: "v1" });
    }

    if (method === "GET" && parts[0] === "me") {
      return json({ data: await getApiCurrentUser() });
    }

    if (parts[0] === "aircraft") {
      const allAircraft = await getApiAircraft();

      if (method === "GET" && parts.length === 1) {
        return json({ data: allAircraft });
      }

      if (method === "GET" && parts.length === 2) {
        const aircraft = allAircraft.find((item) => item.id === parts[1]);
        return aircraft ? json({ data: aircraft }) : notFound(url.pathname);
      }

      if (method === "POST" && parts.length === 1) {
        const parsed = aircraftInputSchema.safeParse(await readJson(request));
        if (!parsed.success) return validationError(parsed.error);
        return json({ data: await createApiAircraft(parsed.data) }, { status: 201 });
      }
    }

    if (method === "GET" && parts[0] === "parts" && parts[1] === "search") {
      return json({
        data: await searchApiParts({
          query: url.searchParams.get("q") ?? undefined,
          aircraftId: url.searchParams.get("aircraftId") ?? undefined,
          registration: url.searchParams.get("registration") ?? undefined,
        }),
        meta: {
          requestableByDefault: true,
          note: "A part can be requested even when it is not yet in the intelligence index.",
        },
      });
    }

    if (parts[0] === "aog-requests") {
      const allRequests = await getApiAogRequests();

      if (method === "GET" && parts.length === 1) {
        return json({ data: allRequests });
      }

      if (method === "GET" && parts.length === 2) {
        const requestItem = allRequests.find((item) => item.id === parts[1]);
        return requestItem ? json({ data: requestItem }) : notFound(url.pathname);
      }

      if (method === "POST" && parts.length === 1) {
        const parsed = aogInputSchema.safeParse(await readJson(request));
        if (!parsed.success) return validationError(parsed.error);
        return json({ data: await createApiAogRequest(parsed.data) }, { status: 201 });
      }

      if (method === "PATCH" && parts.length === 3 && parts[2] === "status") {
        const parsed = statusInputSchema.safeParse(await readJson(request));
        if (!parsed.success) return validationError(parsed.error);
        return json({ data: await updateApiAogStatus(parts[1], parsed.data.status) });
      }
    }

    if (method === "GET" && parts[0] === "admin" && parts[1] === "overview") {
      return json({ data: await getApiAdminOverview() });
    }

    return notFound(url.pathname);
  } catch (error) {
    const status = statusForError(error);
    return json(
      {
        error: {
          code: codeForStatus(status),
          message: error instanceof Error ? error.message : "Unexpected PlaneServe API error.",
        },
      },
      { status },
    );
  }
}

export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleApiRequest(request),
      POST: ({ request }: { request: Request }) => handleApiRequest(request),
      PATCH: ({ request }: { request: Request }) => handleApiRequest(request),
    },
  },
});
