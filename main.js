const { readFile, writeFile } = require("./helpers/functions");
const http = require(`node:http`);
const path = require(`node:path`);
const PORT = 3000;

const server = http.createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  const method = request.method;
  const url = request.url.split("/");
  const dataPath = path.resolve("./data/quiz.json");
  const quiz = readFile(dataPath);

  // GET method
  if (method === "GET") {
    if (url[1] === "quiz") {
      response.statusCode = 200;
      response.end(JSON.stringify(quiz));
      return;
    }
    response.statusCode = 400;
    response.end(
      JSON.stringify({ message: "davom etish uchun `quiz` yozilishi kerak!" })
    );
    return;
  }

  //  Delete method
  if (method === "DELETE") {
    if (url[1] === "quiz" && url[2] && Number(url[2])) {
      const quizId = Number(url[2]);
      const quizIndex = quiz.findIndex((q) => q.id === quizId);
      if (quizIndex === -1) {
        response.statusCode = 404;
        response.end(
          JSON.stringify({
            message: "Quiz not founded!",
          })
        );
        return;
      }
      quiz.splice(quizIndex, 1);
      writeFile(dataPath, quiz);
      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: "Quiz deleted!",
        })
      );
      return;
    }
  }

  //   POST method
  if (method === "POST") {
    if (url[1] === "quiz") {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        const { title, answers } = JSON.parse(body);
        const newQuiz = {
          id: quiz.at(-1)?.id + 1 || 1,
          title,
          answers,
        };
        quiz.push(newQuiz);
        writeFile(dataPath, quiz);
        response.statusCode = 201;
        response.end(
          JSON.stringify({
            message: "quiz created!",
          })
        );
      });
      return;
    }
  }
  //   PATCH method
  if (method === "PATCH") {
    if (url[1] === "quiz" && url[2] && Number(url[2])) {
      const quizId = Number(url[2]);
      const quizIndex = quiz.findIndex((q) => q.id === quizId);
      if (quizIndex === -1) {
        response.statusCode = 404;
        response.end(
          JSON.stringify({
            message: "Quiz not founded!",
          })
        );
        return;
      }
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        const { title, answers } = JSON.parse(body);
        quiz[quizIndex] = { ...quiz[quizIndex], title, answers };
        writeFile(dataPath, quiz);
        response.statusCode = 200;
        response.end(
          JSON.stringify({
            message: "quiz updated",
          })
        );
      });
      return;
    }
  }

  //   PUT method
  if (method === "PUT") {
    if (url[1] === "quiz" && url[2] && Number(url[2])) {
      const quizId = Number(url[2]);
      const quizIndex = quiz.findIndex((q) => q.id === quizId);
      if (quizIndex === -1) {
        response.statusCode = 404;
        response.end(
          JSON.stringify({
            message: "quiz not founded!",
          })
        );
        return;
      }
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        try {
          const updatedQuiz = JSON.parse(body);
          if (!updatedQuiz.title || !updatedQuiz.answers) {
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                message: "Quiz not completed!",
              })
            );
            return;
          }
          quiz[quizIndex] = { id: quizId, ...updatedQuiz };
          writeFile(dataPath, quiz);
          response.statusCode = 200;
          response.end(
            JSON.stringify({
              message: "quiz updated!",
            })
          );
        } catch (error) {
          response.statusCode = 400;
          response.end(
            JSON.stringify({
                message: "Error while update",
              })
          );
        }
      });
      return;
    }
  }
});
server.listen(PORT, () => {
  console.log(`server running port on ${PORT} `);
});
