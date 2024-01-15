export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(_request: Request) {
    return new Response("hello world");
}
