import "mocha";
import { expect } from "chai";
import { pushTo } from "../../src/helpers/dictionary.helper";
import { Settings } from "../../src/generators/settings";

describe("config helpers: pushTo", () => {

    it("should save values with prefix", () => {
        const storage: NodeJS.Dict<string> = {};
        const prefix = "PREFIX_";
        const values = {
            ...new Settings().website,
            webAnalyticType: "something",
            webAnalyticKey: "something",
            trackingCode: "something",
            shortcutIcon: "something"
        };

        pushTo(storage, values, prefix);

        expect(storage[prefix + "WATERMARK"]).to.be.eq(`${values.watermark}`);
        expect(storage[prefix + "WATERMARKTEXT"]).to.be.eq(`${values.watermarkText}`);
        expect(storage[prefix + "COLORSCHEME"]).to.be.eq(`${values.colorScheme}`);
        expect(storage[prefix + "WEBANALYTICTYPE"]).to.be.eq(`${values.webAnalyticType}`);
        expect(storage[prefix + "WEBANALYTICKEY"]).to.be.eq(`${values.webAnalyticKey}`);
        expect(storage[prefix + "TRACKINGCODE"]).to.be.eq(`${values.trackingCode}`);
        expect(storage[prefix + "SHORTCUTICON"]).to.be.eq(`${values.shortcutIcon}`);
    });
    
    it("should save values without prefix", () => {
        const storage: NodeJS.Dict<string> = {};
        const values = {
            value: "something"
        };

        pushTo(storage, values);

        expect(storage.VALUE).to.be.eq(`${values.value}`);
    });

});

