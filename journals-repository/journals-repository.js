import { JournalsBuilder } from "./journals-builder/journals-builder.js";

export class JournalsRepository {
    getJournals() {
        return new JournalsBuilder().buildJournals();
    }
};
