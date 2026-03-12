async function test() {
    try {
        const response = await fetch("http://127.0.0.1:3000/analyze-portfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ githubUrl: "octocat" })
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}
test();
