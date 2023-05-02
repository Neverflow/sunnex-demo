import { mount } from "@vue/test-utils";
import HighLightText from "@/components/HighLightText.vue";
describe("HighlightText.vue", () => {
  it("should renders original text when search text is empty", () => {
    const text = "This is some text";
    const search = "";
    const wrapper = mount(HighLightText, {
      props: { text, search },
    });
    expect(wrapper.text()).toBe(text);
  });

  it("should renders original text when search text is not found", () => {
    const text = "This is some text";
    const search = "not found";
    const wrapper = mount(HighLightText, {
      props: { text, search },
    });
    expect(wrapper.text()).toBe(text);
  });

  it("should renders highlighted text when search text is found", () => {
    const text = "This is some text";
    const search = "some";
    const wrapper = mount(HighLightText, {
      props: { text, search },
    });
    expect(wrapper.html()).toContain(
      '<span style="background-color: yellow">some</span>'
    );
  });

  it("should renders multiple occurrences of highlighted text", () => {
    const text = "This is some text with some more text";
    const search = "some";
    const wrapper = mount(HighLightText, {
      props: { text, search },
    });
    expect(
      wrapper
        .html()
        .match(/<span style="background-color: yellow">some<\/span>/g)
    ).toHaveLength(2);
  });
});
