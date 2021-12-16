export interface AuditLog {
    pk: number;
    actor: string;
    timestamp: string;
    object_repr: string;
    action: number;
    remote_addr: string;
    changes: Map<string, string[]>;
}
