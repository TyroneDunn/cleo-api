import { CleoAPI } from "./src/cleo-api/cleo-api";
import { JournalsFileRepository } from "./src/journal-repository/journal-file-repository";

const PORT = 5011;
const api = new CleoAPI(PORT, new JournalsFileRepository());
api.run();