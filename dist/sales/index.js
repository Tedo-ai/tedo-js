class SalesService {
  req;
  reqVoid;
  /** @internal — constructed by Tedo client. */
  constructor(client) {
    this.req = client._request;
    this.reqVoid = client._requestVoid;
  }
  /** Format a Date or ISO string to YYYY-MM-DD for the API. */
  formatDate(value) {
    if (!value) return void 0;
    if (value instanceof Date) return value.toISOString().split("T")[0];
    return value;
  }
  // ============================================================
  // PIPELINES
  // ============================================================
  /** Create a new pipeline. */
  async createPipeline(params) {
    return this.req("POST", "/sales/v1/pipelines", params);
  }
  /** List all pipelines. */
  async listPipelines() {
    return this.req("GET", "/sales/v1/pipelines");
  }
  /** Get a pipeline by ID. */
  async getPipeline(id) {
    return this.req("GET", `/sales/v1/pipelines/${id}`);
  }
  /** Update a pipeline. */
  async updatePipeline(id, params) {
    return this.req("PATCH", `/sales/v1/pipelines/${id}`, params);
  }
  /** Delete a pipeline. */
  async deletePipeline(id) {
    return this.reqVoid("DELETE", `/sales/v1/pipelines/${id}`);
  }
  // ============================================================
  // STAGES
  // ============================================================
  /** Create a stage within a pipeline. */
  async createStage(pipelineId, params) {
    return this.req(
      "POST",
      "/sales/v1/stages",
      { pipeline_id: pipelineId, ...params }
    );
  }
  /** List all stages in a pipeline. */
  async listStages(pipelineId) {
    return this.req("GET", "/sales/v1/stages", void 0, {
      pipeline_id: pipelineId
    });
  }
  /** Get a stage by ID. */
  async getStage(id) {
    return this.req("GET", `/sales/v1/stages/${id}`);
  }
  /** Update a stage. */
  async updateStage(id, params) {
    return this.req("PATCH", `/sales/v1/stages/${id}`, params);
  }
  /** Delete a stage. */
  async deleteStage(id) {
    return this.reqVoid("DELETE", `/sales/v1/stages/${id}`);
  }
  // ============================================================
  // LEADS
  // ============================================================
  /** Create a new lead. */
  async createLead(params) {
    return this.req("POST", "/sales/v1/leads", params);
  }
  /** List leads, optionally filtered by pipeline. */
  async listLeads(params) {
    const query = {};
    if (params?.pipeline_id) query.pipeline_id = params.pipeline_id;
    return this.req(
      "GET",
      "/sales/v1/leads",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get a lead by ID. */
  async getLead(id) {
    return this.req("GET", `/sales/v1/leads/${id}`);
  }
  /** Update a lead. */
  async updateLead(id, params) {
    return this.req("PATCH", `/sales/v1/leads/${id}`, params);
  }
  /** Delete a lead. */
  async deleteLead(id) {
    return this.reqVoid("DELETE", `/sales/v1/leads/${id}`);
  }
  /** Move a lead to a different stage. */
  async moveLeadStage(id, stageId) {
    return this.req("POST", `/sales/v1/leads/${id}/move`, {
      stage_id: stageId
    });
  }
  /** Convert a lead into a deal. */
  async convertLeadToDeal(id, params) {
    return this.req("POST", `/sales/v1/leads/${id}/convert`, params);
  }
  // ============================================================
  // DEALS
  // ============================================================
  /** Create a new deal. */
  async createDeal(params) {
    return this.req("POST", "/sales/v1/deals", {
      ...params,
      expected_close_date: this.formatDate(params.expected_close_date)
    });
  }
  /** List deals, optionally filtered by pipeline. */
  async listDeals(params) {
    const query = {};
    if (params?.pipeline_id) query.pipeline_id = params.pipeline_id;
    return this.req(
      "GET",
      "/sales/v1/deals",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get a deal by ID. */
  async getDeal(id) {
    return this.req("GET", `/sales/v1/deals/${id}`);
  }
  /** Update a deal. */
  async updateDeal(id, params) {
    return this.req("PATCH", `/sales/v1/deals/${id}`, {
      ...params,
      expected_close_date: this.formatDate(params.expected_close_date)
    });
  }
  /** Delete a deal. */
  async deleteDeal(id) {
    return this.reqVoid("DELETE", `/sales/v1/deals/${id}`);
  }
  /** Move a deal to a different stage. */
  async moveDealStage(id, stageId) {
    return this.req("POST", `/sales/v1/deals/${id}/move`, {
      stage_id: stageId
    });
  }
  // ============================================================
  // ACTIVITIES
  // ============================================================
  /** Create a new activity. */
  async createActivity(params) {
    return this.req("POST", "/sales/v1/activities", {
      ...params,
      due_date: this.formatDate(params.due_date)
    });
  }
  /** List activities, optionally filtered by lead, deal, or type. */
  async listActivities(params) {
    const query = {};
    if (params?.lead_id) query.lead_id = params.lead_id;
    if (params?.deal_id) query.deal_id = params.deal_id;
    if (params?.type) query.type = params.type;
    return this.req(
      "GET",
      "/sales/v1/activities",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get an activity by ID. */
  async getActivity(id) {
    return this.req("GET", `/sales/v1/activities/${id}`);
  }
  /** Update an activity. */
  async updateActivity(id, params) {
    return this.req("PATCH", `/sales/v1/activities/${id}`, {
      ...params,
      due_date: this.formatDate(params.due_date)
    });
  }
  /** Delete an activity. */
  async deleteActivity(id) {
    return this.reqVoid("DELETE", `/sales/v1/activities/${id}`);
  }
  /** Mark an activity as completed or uncompleted. */
  async completeActivity(id, completed = true) {
    return this.req("POST", `/sales/v1/activities/${id}/complete`, {
      completed
    });
  }
  // ============================================================
  // NOTES
  // ============================================================
  /** Create a new note. */
  async createNote(params) {
    return this.req("POST", "/sales/v1/notes", params);
  }
  /** List notes, optionally filtered by lead or deal. */
  async listNotes(params) {
    const query = {};
    if (params?.lead_id) query.lead_id = params.lead_id;
    if (params?.deal_id) query.deal_id = params.deal_id;
    return this.req(
      "GET",
      "/sales/v1/notes",
      void 0,
      Object.keys(query).length ? query : void 0
    );
  }
  /** Get a note by ID. */
  async getNote(id) {
    return this.req("GET", `/sales/v1/notes/${id}`);
  }
  /** Update a note. */
  async updateNote(id, params) {
    return this.req("PATCH", `/sales/v1/notes/${id}`, params);
  }
  /** Delete a note. */
  async deleteNote(id) {
    return this.reqVoid("DELETE", `/sales/v1/notes/${id}`);
  }
  // ============================================================
  // CONTACT BASES
  // ============================================================
  /** Create a new contact base. */
  async createContactBase(params) {
    return this.req("POST", "/sales/v1/contact-bases", params);
  }
  /** List all contact bases. */
  async listContactBases() {
    return this.req("GET", "/sales/v1/contact-bases");
  }
  /** Get a contact base by ID. */
  async getContactBase(id) {
    return this.req("GET", `/sales/v1/contact-bases/${id}`);
  }
  // ============================================================
  // PERSONS
  // ============================================================
  /** Create a new person in a contact base. */
  async createPerson(contactBaseId, params) {
    return this.req(
      "POST",
      `/sales/v1/contact-bases/${contactBaseId}/persons`,
      params
    );
  }
  /** List all persons in a contact base. */
  async listPersons(contactBaseId) {
    return this.req(
      "GET",
      `/sales/v1/contact-bases/${contactBaseId}/persons`
    );
  }
  /** Get a person by ID. */
  async getPerson(id) {
    return this.req("GET", `/sales/v1/persons/${id}`);
  }
  /** Update a person. */
  async updatePerson(id, params) {
    return this.req("PATCH", `/sales/v1/persons/${id}`, params);
  }
  /** Delete a person. */
  async deletePerson(id) {
    return this.reqVoid("DELETE", `/sales/v1/persons/${id}`);
  }
  // ============================================================
  // ORGANIZATIONS
  // ============================================================
  /** Create a new organization in a contact base. */
  async createOrganization(contactBaseId, params) {
    return this.req(
      "POST",
      `/sales/v1/contact-bases/${contactBaseId}/organizations`,
      params
    );
  }
  /** List all organizations in a contact base. */
  async listOrganizations(contactBaseId) {
    return this.req(
      "GET",
      `/sales/v1/contact-bases/${contactBaseId}/organizations`
    );
  }
  /** Get an organization by ID. */
  async getOrganization(id) {
    return this.req("GET", `/sales/v1/organizations/${id}`);
  }
  /** Update an organization. */
  async updateOrganization(id, params) {
    return this.req(
      "PATCH",
      `/sales/v1/organizations/${id}`,
      params
    );
  }
  /** Delete an organization. */
  async deleteOrganization(id) {
    return this.reqVoid("DELETE", `/sales/v1/organizations/${id}`);
  }
}
export {
  SalesService
};
//# sourceMappingURL=index.js.map
