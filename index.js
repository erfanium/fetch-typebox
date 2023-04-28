"use strict";
class ResponseValidationError extends Error {}
exports.ResponseValidationError = ResponseValidationError;

class TypedResponse extends Response {
  constructor(response) {
    super(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  async json(compiler) {
    if (!compiler) return super.json();
    const body = await super.json();
    const result = compiler.Check(body);
    if (result) return body;

    const errors = compiler.Errors(body);
    const firstError = errors.First();

    throw new ResponseValidationError(firstError?.message, {
      cause: firstError,
    });
  }
}
exports.TypedResponse = TypedResponse;

const typeboxFetch = async (input, init) => {
  const response = await fetch(input, init);
  return new TypedResponse(response);
};

exports.fetch = typeboxFetch;
