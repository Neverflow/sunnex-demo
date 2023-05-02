import CustomModal from "@/components/CustomModal.vue";
import { mount } from "@vue/test-utils";

describe("CustomModal.vue", () => {
  it("should renders correctly", () => {
    const wrapper = mount(CustomModal, {
      props: {
        title: "Test CustomModal",
        visible: true,
      },
      slots: {
        default: "<p>Test Content</p>",
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should is not visible by default", () => {
    const wrapper = mount(CustomModal, {
      props: {
        title: "Test CustomModal",
        visible: false,
      },
      slots: {
        default: "<p>Test Content</p>",
      },
    });

    expect(wrapper.find(".modal-container").isVisible()).toBe(false);
  });
  it("should closes when clicking close button", async () => {
    const wrapper = mount(CustomModal, {
      props: {
        title: "Test CustomModal",
        visible: true,
      },
      slots: {
        default: "<p>Test Content</p>",
      },
    });

    await wrapper.find(".modal-close").trigger("click");
    expect(wrapper.emitted("update:visible")?.[0]).toEqual([false]);
  });

  it("should displays content correctly", () => {
    const wrapper = mount(CustomModal, {
      props: {
        title: "Test CustomModal",
        visible: true,
      },
      slots: {
        default: "<p>Test Content</p>",
      },
    });

    expect(wrapper.find(".modal-body p").text()).toBe("Test Content");
  });
});
