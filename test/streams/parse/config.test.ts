import "mocha";
import { expect } from "chai";
import Config, { DefaultGroup } from "../../../src/streams/parse/config";
import { Settings } from "../../../src/generators/settings";

describe("Config class", () => {
    it("should use default settings when ctor called without params", () => {
        const expected = new Settings();

        const result = new Config();

        expect(result.isLess).to.be.false;
        expect(result.isSilent).to.be.false;
        expect(result.autofill).to.be.eq(expected.autofill);
        expect(result.privatePrefix).to.be.eq(expected.privatePrefix);
        expect(result.displayAccess).to.be.deep.eq(expected.displayAccess);
        expect(result.disableAutofill).to.be.deep.eq(expected.disableAutofill);
        expect(result.groups).to.be.deep.eq({
            undefined: DefaultGroup
        });

    });

    it("should convert groups object keys to lower case", () => {
        const settings = new Settings(`{ 
            "groups": { 
                "ABC": "abc",
                "ONEtwo": "onetwo",
                "oneTWO": "onetwo"
            }
        }`);

        const result = new Config({ settings });

        for (const x of Object.keys(result.groups)) {
            expect(x).to.be.eq(x.toLowerCase());
        }
    });

    it("should have default mapping for undefined group", () => {
        const settings = new Settings(`{ 
            "groups": { 
                "someGroup": "Some Human-Readable Title"
            }
        }`);

        const result = new Config({ settings });

        expect(result.groups.somegroup).to.be.eq("Some Human-Readable Title");
        expect(result.groups.undefined).to.be.eq(DefaultGroup);
    });

    it("should replace group with human-readable title", () => {
        const expected = "Some Human-Readable Title";
        const settings = new Settings(`{ 
            "groups": { 
                "someGroup": "${expected}"
            }
        }`);

        const result = new Config({ settings });

        expect(result.tryReplaceGroup("somegroup")).to.be.eq(expected);
        expect(result.tryReplaceGroup("SomeGroup")).to.be.eq(expected);
        expect(result.tryReplaceGroup("Undefined")).to.be.eq(DefaultGroup);
    });

    it("should replace empty-string group with default human-readable title", () => {
        const result = new Config({ settings: new Settings() });

        expect(result.tryReplaceGroup("")).to.be.eq(DefaultGroup);
        expect(result.tryReplaceGroup("   ")).to.be.eq(DefaultGroup);
    });

    it("should return input group if replacement was not found", () => {
        const input = "Group-With-No-Replacement";
        const result = new Config({ settings: new Settings() });

        expect(result.tryReplaceGroup(input)).to.be.eq(input.toLowerCase());
    });

    it("should return default group as human-readable title of undefined", () => {
        const result = new Config({ settings: new Settings() });

        expect(result.defaultGroup).to.be.eq(result.groups.undefined);
    });

    it("should extract file extension in lower case", () => {
        const expected = "TEST";
        const result = new Config({ path: `some-file.${expected}` });

        expect(result.lang).to.be.eq(expected.toLowerCase());
    });

    it("should set isLess by file extension", () => {
        let result = new Config({ path: `some-file.LESS` });
        expect(result.isLess).to.be.true;

        result = new Config({ path: `some-file.other` });
        expect(result.isLess).to.be.false;
    });

    it("should set default values dependent of filename", () => {
        const result = new Config({ path: undefined });
        expect(result.lang).to.be.empty;
        expect(result.isLess).to.be.false;
    });

});
