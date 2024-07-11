import { app } from "./app.js"

app.listen(process.env.PORT || 8000, () => {
    console.log(`App is listening on port: 8000`);
})