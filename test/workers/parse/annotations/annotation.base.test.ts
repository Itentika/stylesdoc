import "mocha";
import { expect } from "chai";
import { buildAnnotations } from "../../../../src/workers/parse/annotation.provider";
import Config from "../../../../src/streams/parse/config";

const AutofilledNames = ["access", "content", "require", "throw"];

describe("Annotation base", () => {
    
    it("should return isAutofilled=true if annotation uses autofill", () => {
        const config = new Config();
        const autofilled = buildAnnotations(config).filter(x => AutofilledNames.includes(x.name));

        expect(autofilled.length).to.be.eq(AutofilledNames.length, "Expected number of autofilled");
        for (const annotation of autofilled) {
            expect(annotation.isAutofilled).to.be.true;
        }
    });
    
    it("should return isAutofilAllowed=false if autofill disabled", () => {
        const config = new Config();
        config.autofill = false;

        const autofilled = buildAnnotations(config).filter(x => AutofilledNames.includes(x.name));

        expect(autofilled.length).to.be.eq(AutofilledNames.length, "Expected number of autofilled");
        for (const annotation of autofilled) {
            expect(annotation.isAutofilAllowed).to.be.false;
        }
    });
  
    it("should return isAutofilAllowed=false if autofill disabled for Access", () => {
        const config = new Config();
        config.autofill = true;
        config.disableAutofill = AutofilledNames;

        const autofilled = buildAnnotations(config).filter(x => AutofilledNames.includes(x.name));

        expect(autofilled.length).to.be.eq(AutofilledNames.length, "Expected number of autofilled");
        for (const annotation of autofilled) {
            expect(annotation.isAutofilAllowed).to.be.false;
        }        
    });
});