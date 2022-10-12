import Annotation from "./annotations/base";
import Config from "../../streams/parse/config";
import * as annotationTypes from "./annotations";

export const buildAnnotations = (config: Config): Annotation[] =>
    Object
        .values(annotationTypes)
        .map((Annotation) => new Annotation(config));
