import {run as RunCleoApi} from "./api/cleo-api";
import {API_PORT as port} from "./environment";

RunCleoApi(port);