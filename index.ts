import { CleoAPI } from "./cleo-api/cleo-api";
import { JournalsFileRepository } from "./journals-repository/journal-repository";

const PORT = 5011;
const api = new CleoAPI(PORT, new JournalsFileRepository());
api.run();