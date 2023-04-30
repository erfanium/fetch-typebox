import { Static, TSchema } from "@sinclair/typebox";
import { TypeCheck } from "@sinclair/typebox/compiler";

export class ResponseValidationError extends Error {}

export class TypedResponse extends Response {
  constructor(response: Response);

  // @ts-expect-error
  async json<T extends TSchema = unknown>(
    compiler?: TypeCheck<T>
  ): Promise<Static<T>>;
}

declare function typeboxFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<TypedResponse>;

export { typeboxFetch as fetch };
