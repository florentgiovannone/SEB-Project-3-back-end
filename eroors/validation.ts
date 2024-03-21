export default function formatValidationError(err: any) {
    const customError: any = {}
    for (const key in err.errors) {
        customError[key] = err.errors[key].message
    }
    return customError
}