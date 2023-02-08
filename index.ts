import { CleoAPI } from "./cleo-server/cleo-api.ts";
import { JournalsFileRepository } from "./journals-repository/journals-repository.ts";

const PORT = 5011;
const api = new CleoAPI(PORT, new JournalsFileRepository())