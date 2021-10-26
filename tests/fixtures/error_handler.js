export default function (err) {
    if (err.message === "nuxtError") {
        return err.ctx.error({ statusCode: 500, message: err.message });
    }

    throw err;
}
