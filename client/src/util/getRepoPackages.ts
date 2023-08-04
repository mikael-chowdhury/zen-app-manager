import axios from "axios";
import urlJoin from "./joinURL";

export default (repo: string): Promise<string[]> => {
  return new Promise(async (res, rej) => {
    axios.get(urlJoin(repo, "getpackages")).then(
      (response) => {
        if (response.data instanceof Array) {
          res(response.data);
        } else {
          console.error(
            "\n\nInvalid response recieved from repo. Potentially malicious. Response: "
          );
          console.log(response.data);
        }
      },
      (error) => {
        if (error.cause.code == "ECONNREFUSED") {
          console.error(
            `\n\nCONNECTION ERROR\nplease check the status of your internet connection, and the repo being requested (${repo})`
          );
        }
      }
    );
  });
};
