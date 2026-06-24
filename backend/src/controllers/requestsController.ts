import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  createCareRequestSchema,
  CreateCareRequestInput,
} from "../validators/requestValidator";
import {
  createCareRequest,
  getAllCareRequests,
} from "../services/requestsService";

function formatZodErrors(error: ZodError) {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

export async function postCareRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed: CreateCareRequestInput = createCareRequestSchema.parse(
      req.body
    );
    const careRequest = await createCareRequest(parsed);

    res.status(201).json({
      success: true,
      message: "Demande de soin enregistrée avec succès",
      data: careRequest,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: formatZodErrors(error),
      });
      return;
    }
    next(error);
  }
}

export async function getCareRequests(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const requests = await getAllCareRequests();

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    next(error);
  }
}
