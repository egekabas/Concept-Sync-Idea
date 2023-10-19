import { mergeConcepts } from "./componentMergers";
import { Concept, ObjectId } from "./types";

interface CRD<T> extends Concept {
  create(x: T): ObjectId;
  read(id: ObjectId): T;
  delete(id: ObjectId): void;
}

interface CRD_EXTENSION<T> extends Concept {
  create(id: ObjectId, x: T): void;
  read(id: ObjectId): T;
  delete(id: ObjectId): void;
}

type MovieDoc = { name: string; year: number };
class MovieConcept implements CRD<MovieDoc> {
  private readonly db = new Map<ObjectId, MovieDoc>();
  private nextId = 0;

  create(x: MovieDoc): number {
    this.db.set(this.nextId, x);
    this.nextId++;
    return this.nextId - 1;
  }
  read(id: number): MovieDoc {
    const val = this.db.get(id);
    if (val === undefined) {
      throw new Error("Not found");
    }
    return val;
  }
  delete(id: number): void {
    this.db.delete(id);
  }
}

type GenreDoc = { genre: string };
class GenreConcept implements CRD_EXTENSION<GenreDoc> {
  private readonly db = new Map<ObjectId, GenreDoc>();

  create(id: number, x: GenreDoc): void {
    if (this.db.has(id)) throw new Error("Already exists");
    this.db.set(id, x);
  }
  read(id: number): GenreDoc {
    const val = this.db.get(id);
    if (val === undefined) {
      throw new Error("Not found");
    }
    return val;
  }
  delete(id: number): void {
    this.db.delete(id);
  }
}

function addCrudExtension<
  T,
  U,
  BASE_T extends CRD<T>,
  EXT_T extends CRD_EXTENSION<U>,
>(base: BASE_T, extension: EXT_T) {
  return {
    ...mergeConcepts(base, extension),
    create: (baseVal: T, extVal: U) => {
      const id = base.create(baseVal);
      extension.create(id, extVal);
      return id;
    },
    read: (id: ObjectId) => {
      return {
        ...base.read(id),
        ...extension.read(id),
      };
    },
    delete: (id: ObjectId) => {
      base.delete(id);
      extension.delete(id);
    },
  };
}

const movie = new MovieConcept();
const genre = new GenreConcept();

const movieWithGenre = addCrudExtension<
  MovieDoc,
  GenreDoc,
  MovieConcept,
  GenreConcept
>(movie, genre);

const movieId = movieWithGenre.create(
  {
    name: "The Matrix",
    year: 1999,
  },
  {
    genre: "Sci-Fi",
  },
);

console.log(movieWithGenre.read(movieId));
