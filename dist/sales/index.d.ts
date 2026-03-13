import type { Transport } from "../transport.js";
import type { Pipeline, CreatePipelineParams, UpdatePipelineParams, PipelineStage, CreateStageParams, UpdateStageParams, Lead, CreateLeadParams, UpdateLeadParams, ListLeadsParams, ConvertLeadParams, Deal, CreateDealParams, UpdateDealParams, ListDealsParams, Activity, CreateActivityParams, UpdateActivityParams, ListActivitiesParams, Note, CreateNoteParams, UpdateNoteParams, ListNotesParams, ContactBase, CreateContactBaseParams, Person, CreatePersonParams, UpdatePersonParams, Organization, CreateOrganizationParams, UpdateOrganizationParams } from "./types.js";
type RequestFn = <T>(method: string, path: string, body?: unknown, query?: Record<string, string>) => Promise<T>;
type RequestVoidFn = (method: string, path: string, body?: unknown) => Promise<void>;
/** Internal type for the transport accessor needed by pagination. */
interface ClientInternals {
    _request: RequestFn;
    _requestVoid: RequestVoidFn;
    _transport: Transport;
}
/** Sales service — pipelines, stages, leads, deals, activities,
 *  notes, persons, and organizations. */
export declare class SalesService {
    private req;
    private reqVoid;
    /** @internal — constructed by Tedo client. */
    constructor(client: ClientInternals);
    /** Format a Date or ISO string to YYYY-MM-DD for the API. */
    private formatDate;
    /** Create a new pipeline. */
    createPipeline(params: CreatePipelineParams): Promise<Pipeline>;
    /** List all pipelines. */
    listPipelines(): Promise<{
        pipelines: Pipeline[];
        total: number;
    }>;
    /** Get a pipeline by ID. */
    getPipeline(id: string): Promise<Pipeline>;
    /** Update a pipeline. */
    updatePipeline(id: string, params: UpdatePipelineParams): Promise<Pipeline>;
    /** Delete a pipeline. */
    deletePipeline(id: string): Promise<void>;
    /** Create a stage within a pipeline. */
    createStage(pipelineId: string, params: CreateStageParams): Promise<PipelineStage>;
    /** List all stages in a pipeline. */
    listStages(pipelineId: string): Promise<{
        stages: PipelineStage[];
        total: number;
    }>;
    /** Get a stage by ID. */
    getStage(id: string): Promise<PipelineStage>;
    /** Update a stage. */
    updateStage(id: string, params: UpdateStageParams): Promise<PipelineStage>;
    /** Delete a stage. */
    deleteStage(id: string): Promise<void>;
    /** Create a new lead. */
    createLead(params: CreateLeadParams): Promise<Lead>;
    /** List leads, optionally filtered by pipeline. */
    listLeads(params?: ListLeadsParams): Promise<{
        leads: Lead[];
        total: number;
    }>;
    /** Get a lead by ID. */
    getLead(id: string): Promise<Lead>;
    /** Update a lead. */
    updateLead(id: string, params: UpdateLeadParams): Promise<Lead>;
    /** Delete a lead. */
    deleteLead(id: string): Promise<void>;
    /** Move a lead to a different stage. */
    moveLeadStage(id: string, stageId: string): Promise<Lead>;
    /** Convert a lead into a deal. */
    convertLeadToDeal(id: string, params: ConvertLeadParams): Promise<Deal>;
    /** Create a new deal. */
    createDeal(params: CreateDealParams): Promise<Deal>;
    /** List deals, optionally filtered by pipeline. */
    listDeals(params?: ListDealsParams): Promise<{
        deals: Deal[];
        total: number;
    }>;
    /** Get a deal by ID. */
    getDeal(id: string): Promise<Deal>;
    /** Update a deal. */
    updateDeal(id: string, params: UpdateDealParams): Promise<Deal>;
    /** Delete a deal. */
    deleteDeal(id: string): Promise<void>;
    /** Move a deal to a different stage. */
    moveDealStage(id: string, stageId: string): Promise<Deal>;
    /** Create a new activity. */
    createActivity(params: CreateActivityParams): Promise<Activity>;
    /** List activities, optionally filtered by lead, deal, or type. */
    listActivities(params?: ListActivitiesParams): Promise<{
        activities: Activity[];
        total: number;
    }>;
    /** Get an activity by ID. */
    getActivity(id: string): Promise<Activity>;
    /** Update an activity. */
    updateActivity(id: string, params: UpdateActivityParams): Promise<Activity>;
    /** Delete an activity. */
    deleteActivity(id: string): Promise<void>;
    /** Mark an activity as completed or uncompleted. */
    completeActivity(id: string, completed?: boolean): Promise<Activity>;
    /** Create a new note. */
    createNote(params: CreateNoteParams): Promise<Note>;
    /** List notes, optionally filtered by lead or deal. */
    listNotes(params?: ListNotesParams): Promise<{
        notes: Note[];
        total: number;
    }>;
    /** Get a note by ID. */
    getNote(id: string): Promise<Note>;
    /** Update a note. */
    updateNote(id: string, params: UpdateNoteParams): Promise<Note>;
    /** Delete a note. */
    deleteNote(id: string): Promise<void>;
    /** Create a new contact base. */
    createContactBase(params: CreateContactBaseParams): Promise<ContactBase>;
    /** List all contact bases. */
    listContactBases(): Promise<{
        contact_bases: ContactBase[];
        total: number;
    }>;
    /** Get a contact base by ID. */
    getContactBase(id: string): Promise<ContactBase>;
    /** Create a new person in a contact base. */
    createPerson(contactBaseId: string, params: CreatePersonParams): Promise<Person>;
    /** List all persons in a contact base. */
    listPersons(contactBaseId: string): Promise<{
        persons: Person[];
        total: number;
    }>;
    /** Get a person by ID. */
    getPerson(id: string): Promise<Person>;
    /** Update a person. */
    updatePerson(id: string, params: UpdatePersonParams): Promise<Person>;
    /** Delete a person. */
    deletePerson(id: string): Promise<void>;
    /** Create a new organization in a contact base. */
    createOrganization(contactBaseId: string, params: CreateOrganizationParams): Promise<Organization>;
    /** List all organizations in a contact base. */
    listOrganizations(contactBaseId: string): Promise<{
        organizations: Organization[];
        total: number;
    }>;
    /** Get an organization by ID. */
    getOrganization(id: string): Promise<Organization>;
    /** Update an organization. */
    updateOrganization(id: string, params: UpdateOrganizationParams): Promise<Organization>;
    /** Delete an organization. */
    deleteOrganization(id: string): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map