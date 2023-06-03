import {run as runCleoApi} from "./api/cleo-api";
import {API_PORT as port} from "./environment";

runCleoApi(port);