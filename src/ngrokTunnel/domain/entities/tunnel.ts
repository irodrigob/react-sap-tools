export default class Tunnel {
  readonly forwards_to: string;
  readonly id: string;
  readonly proto: string;
  readonly public_url: string;
  readonly started_at: string;

  constructor(
    forwards_to: string,
    id: string,
    proto: string,
    public_url: string,
    started_at: string
  ) {
    this.forwards_to = forwards_to;
    this.id = id;
    this.proto = proto;
    this.public_url = public_url;
    this.started_at = started_at;
  }
}
