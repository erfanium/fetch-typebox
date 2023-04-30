import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { fetch } from "../src";

const ResponseType = TypeCompiler.Compile(
  Type.Object({
    id: Type.Number(),
    userId: Type.Number(),
    title: Type.String(),
  })
);

async function main() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const body = await response.json(ResponseType);

  console.log(body);
}

main();
