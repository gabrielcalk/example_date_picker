import { createServer, Factory, Model } from "miragejs";

type Documents = {
  name: string;
  date: string;
  amount: number;
};

export function makeServer() {
  const server = createServer({
    models: {
      document: Model.extend<Partial<Documents>>({})
    },

    // Generate "muito" data
    factories: {
      document: Factory.extend({
        name(i) {
          return `Document ${i}`;
        },
        date(i) {
          return new Date(
            +new Date() - Math.floor(Math.random() * 10000000000)
          );
        },
        amount(i) {
          return i + 100;
        }
      })
    },

    seeds(server) {
      server.createList("document", 50);
    },

    routes(): void {
      this.namespace = "api";
      this.timing = 750;
      // api/documents
      this.get("/documents");
      // api/users
      this.post("/users");
    }
  });

  return server;
}
