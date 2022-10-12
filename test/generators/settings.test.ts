import "mocha";
import { expect } from "chai";
import { Settings } from "../../src/generators/settings";
import { AccessType } from "../../src/global/enums/acessType";
import { ColorScheme } from "../../src/global/enums/colorScheme";
import { ParserSettings } from "../../src/global/types/parser.settings";

describe("build settings from settings.json", () => {

    it("should remove all non-supported access types", () => {
        const json = `{        
            "displayAccess": ["public", "private", "unknown"]
        }`;

        const settings = new Settings(json);

        expect(settings.displayAccess).to.be.deep.eq([AccessType.public, AccessType.private]);
    });

    it("should remove all access types ignoring case", () => {
        const json = `{        
            "displayAccess": ["PUBLIC", "prIVAte"]
        }`;

        const settings = new Settings(json);

        expect(settings.displayAccess).to.be.deep.eq([AccessType.public, AccessType.private]);
    });

    it("should allow boolean for privatePrefix", () => {
        expect(new Settings(`{ "privatePrefix": true }`).privatePrefix).to.be.true;
        expect(new Settings(`{ "privatePrefix": false }`).privatePrefix).to.be.false;
    });

    it("should set values from JSON", () => {
        const expected: ParserSettings = {
            ...new Settings(),
            displayAccess: [AccessType.private],
            exclude: ["example/file1.sass", "example/file2.{scss,less}"],
            privatePrefix: `[_-]`,
            groups: { undefined: "General group"},
            sort: ["abc>", "def <"],
            destination: "c:\\my_folder",
            website: {
                watermark: false,
                watermarkText: "watermark",
                colorScheme: ColorScheme.Purple,
                displayAlias: true,
                webAnalyticType: "web analytic type",
                webAnalyticKey: "web analytic key",
                trackingCode: "tracking code",
                shortcutIcon: "icon",
                basePath: "base"                
            }
        };

        const settings = new Settings(JSON.stringify(expected));

        expect(settings).to.be.deep.eq(expected);
    });

    it("should init settings with default values", () => {
        const settings = new Settings("{}");

        expect(settings.autofill).to.be.true;
        expect(settings.displayAccess).to.be.deep.eq([AccessType.public, AccessType.private]);
        expect(settings.exclude).to.be.empty;

        expect(settings.website.watermark).to.be.true;
        expect(settings.website.watermarkText).to.be.eq("Developed by ITentika");
        expect(settings.website.colorScheme).to.be.eq(ColorScheme.Light);
        expect(settings.website.displayAlias).to.be.eq(false);
        expect(settings.website.basePath).to.be.empty;
    });

    it("should update from flags", () => {        
        const settings = new Settings(`{
            "silent": true,
            "autofill": true,
            "privatePrefix": "[_-]",
            "colorScheme": "light",
            "destination": "/some/folder"
         }`);

        const flags = {
            theme: `${ColorScheme.Dark}`,
            dest: "./other/folder"
        }

        settings.updateFrom(flags);

        expect(settings.destination).to.eq(flags.dest);
        expect(settings.website.colorScheme).to.eq(ColorScheme.Dark);
    });
    
    it("should not update from flags if values not defined", () => {
        const ptrn = "[_-]";
        const color = ColorScheme.Green;
        const dest = "./ouput/folder";
        const settings = new Settings(`{
            "silent": true,
            "autofill": true,
            "privatePrefix": "${ptrn}",
            "destination": "${dest}",
            "website": { "colorScheme": "${color}" }
         }`);

        const flags = {
            dest: undefined,
            silent: undefined,
            autofill: undefined,
            privatePrefix: undefined,
            theme: `unknown color`            
        }

        settings.updateFrom(flags);

        expect(settings.autofill).to.be.true;
        expect(settings.privatePrefix).to.eq(ptrn);
        expect(settings.destination).to.eq(dest);
        expect(settings.website.colorScheme).to.eq(color);
    });
});

