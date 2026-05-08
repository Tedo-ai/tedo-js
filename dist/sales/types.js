const ActivityType = {
  TASK: "task",
  CALL: "call",
  EMAIL: "email",
  MEETING: "meeting",
  DEADLINE: "deadline"
};
const ResourceType = {
  LEAD: "lead",
  DEAL: "deal"
};
const StageOutcome = {
  POSITIVE: "positive",
  NEGATIVE: "negative"
};
const Link = {
  /** Create a link to a lead. */
  lead: (id, primary = true) => ({
    entity_type: "lead",
    entity_id: id,
    is_primary: primary
  }),
  /** Create a link to a deal. */
  deal: (id, primary = true) => ({
    entity_type: "deal",
    entity_id: id,
    is_primary: primary
  }),
  /** Create a link to a person. */
  person: (id, primary = false) => ({
    entity_type: "person",
    entity_id: id,
    is_primary: primary
  }),
  /** Create a link to an organization. */
  organization: (id, primary = false) => ({
    entity_type: "organization",
    entity_id: id,
    is_primary: primary
  })
};
export {
  ActivityType,
  Link,
  ResourceType,
  StageOutcome
};
//# sourceMappingURL=types.js.map
