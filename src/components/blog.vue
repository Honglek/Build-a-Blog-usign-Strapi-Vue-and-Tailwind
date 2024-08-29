<template>
  <div class="bg-gray-100 md:px-10 px-4 py-12 font-[sans-serif]">
    <div
      aria-label="Loading..."
      role="status"
      class="flex items-center space-x-2 justify-center h-screen"
      v-if="!blogs"
    >
      <svg class="h-20 w-20 animate-spin stroke-gray-500" viewBox="0 0 256 256">
        <line
          x1="128"
          y1="32"
          x2="128"
          y2="64"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="195.9"
          y1="60.1"
          x2="173.3"
          y2="82.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="224"
          y1="128"
          x2="192"
          y2="128"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="195.9"
          y1="195.9"
          x2="173.3"
          y2="173.3"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="128"
          y1="224"
          x2="128"
          y2="192"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="60.1"
          y1="195.9"
          x2="82.7"
          y2="173.3"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="32"
          y1="128"
          x2="64"
          y2="128"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
        <line
          x1="60.1"
          y1="60.1"
          x2="82.7"
          y2="82.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="24"
        ></line>
      </svg>
      <span class="text-4xl font-medium text-gray-500">Loading...</span>
    </div>
    <div v-else class="max-w-5xl max-lg:max-w-3xl max-sm:max-w-sm mx-auto">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-8 text-left">Blog</h2>
      <div
        :key="index"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-8"
      >
        <div
          v-for="(blog, index) in blogs"
          :key="index"
          class="bg-white rounded overflow-hidden"
        >
          <!-- Local -->
          <!-- <img
            v-if="blog.attributes.image.data"
            :src="`http://localhost:1337${blog.attributes.image.data.attributes.url}`"
            alt="Blog Post 1"
            class="w-full h-52 object-cover"
          /> -->
          <!-- Cloud -->
          <img
            v-if="blog.attributes.image.data"
            :src="`${blog.attributes.image.data.attributes.url}`"
            :alt="blog.attributes.image.data.attributes.name"
            class="w-full h-52 object-cover"
          />
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-3">
              {{ blog.attributes.title }}
            </h3>
            <!-- Render the truncated first paragraph -->
            <div
              v-html="convertJsonToHtml(blog.attributes.description)"
              class="text-gray-500 text-sm"
            ></div>
            <p class="text-orange-500 text-[13px] font-semibold mt-4">
              {{ formatDate(blog.attributes.createdAt) }}
            </p>
            <a
              @click="OpenBlogView(blog.attributes.slug)"
              href="javascript:void(0);"
              class="mt-4 inline-block px-4 py-2 rounded tracking-wider bg-orange-500 hover:bg-orange-600 text-white text-[13px]"
              >Read More</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/services/axios";
import moment from "moment";
import { ref, onMounted } from "vue";
import router from "@/router";
const blogs = ref([]);

// Fetch the blogs data
const fetchBlogs = () => {
  api
    .get("/blogs?populate=*&sort=id:asc")
    .then((response) => {
      blogs.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Format the date
function formatDate(date) {
  return moment(date).format("DD MMMM  YYYY ");
}

// Convert the JSON structure of the description into HTML, showing only the first paragraph and truncating it
const convertJsonToHtml = (description) => {
  const truncatedText = (text, limit) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + " ...";
    }
    return text;
  };

  // Show only the first paragraph
  const firstParagraph = description.find(
    (block) => block.type === "paragraph"
  );
  if (firstParagraph) {
    const paragraphHtml = firstParagraph.children
      .map((child) => {
        if (child.type === "text") {
          const textHtml = truncatedText(child.text, 20); // Limit to 30 words
          return child.bold ? `<strong>${textHtml}</strong>` : textHtml;
        }
        return "";
      })
      .join("");

    return `<p>${paragraphHtml}</p>`;
  }
  return "";
};
const OpenBlogView = (slug) => {
  router.push({ name: "blog", params: { slug: slug } });
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchBlogs();
});
</script>
