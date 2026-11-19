import sendResponse from "../utils/sendResponse.js";

export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const missingFields = [
        ...new Set(
          result.error.issues
            .filter(
              ({ path }) =>
                path.length > 0 && req.body?.[path[0]] === undefined
            )
            .map(({ path }) => path[0])
        ),
      ];
      const message = missingFields.length
        ? `Missing required fields: ${missingFields.join(", ")}`
        : result.error.issues.map(({ message }) => message).join(", ");

      return sendResponse(res, 400, message, null, false);
    }

    req.body = result.data;
    return next();
  };
}
