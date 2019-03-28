export default function (err, nuxtError) {
    if (err.message === "nuxtError") {
        return nuxtError({statusCode: 500, message: err.message});
    }

    throw err;
}