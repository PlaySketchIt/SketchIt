export const dynamic = "force-dynamic"; // defaults to auto
export const runtime = "edge";

export async function GET(_request: Request) {
    return new Response("hello world");
}
