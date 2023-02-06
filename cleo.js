import { CleoServer } from "./cleo-server/cleo-server.js";
import { JournalsRepository } from "./journals-repository/journals-repository.js";

const PORT = 5011;
const server = new CleoServer(PORT, new JournalsRepository());