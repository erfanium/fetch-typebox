import { Static, TSchema, TUnknown } from "@sinclair/typebox";
import { TypeCheck } from "@sinclair/typebox/compiler";

export class ResponseValidationError extends Error {}

export class TypeBoxResponse extends Response {
  constructor(response: Response) {
    super(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  json(): Promise<unknown>;
  json<T extends TSchema>(typeChecker: TypeCheck<T>): Promise<Static<T>>;
  async json<T extends TSchema = TUnknown>(
    typeChecker?: TypeCheck<T>
  ): Promise<Static<T>> {
    if (!typeChecker) return super.json();
    const body = await super.json();
    const result = typeChecker.Check(body);
    if (result) return body;

    const errors = typeChecker.Errors(body);
    const firstError = errors.First();

    throw new ResponseValidationError(firstError?.message, {
      cause: firstError,
    });
  }
}

async function typeboxFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<TypeBoxResponse> {
  const response = await fetch(input, init);
  return new TypeBoxResponse(response);
}

export { typeboxFetch as fetch, TypeBoxResponse as Response };
