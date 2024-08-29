<template>
  <div class="text-black bg-gray-100">
    <div
      aria-label="Loading..."
      role="status"
      class="flex items-center space-x-2 justify-center h-screen"
      v-if="!blog"
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
    <div
      v-else
      class="w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12 max-w-xl min-h-screen h-full mx-auto py-5"
    >
      <a href="/" class="font-bold pt-5">< Back</a>
      <div v-for="blg in blog" class="text-left text-opacity-80 py-5">
        <!-- Local -->
        <!-- <img
          v-if="blg.attributes.image.data"
          :src="`http://localhost:1337${blg.attributes.image.data.attributes.url}`"
          alt="Blog Post 1"
          class="w-full h-auto object-cover"
        /> -->
        <!-- Cloud -->
        <img
          v-if="blg.attributes.image.data"
          :src="`${blg.attributes.image.data.attributes.url}`"
          :alt="blg.attributes.image.data.attributes.name"
          class="w-full h-auto object-cover"
        />
        <h2 class="text-3xl py-5 font-bold text-orange-500">
          {{ blg.attributes.title }}
        </h2>
        <h6>Published on {{ formatDate(blg.attributes.createdAt) }}</h6>
        <div
          v-html="formattedDescription(blg.attributes.description)"
          class="text-justify my-2"
        ></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watchEffect } from "vue";
import api from "@/services/axios";
import { useRoute } from "vue-router";
import moment from "moment";

const route = useRoute();
const blog = ref();
const fextchBlog = () => {
  api
    .get(`/blogs?filters[slug][$eq]=${route.params.slug}&populate=*`)
    .then((response) => {
      blog.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
function formatDate(date) {
  return moment(date).format("DD MMMM  YYYY, h:mm:ssa ");
}

const formattedDescription = (description) => {
  if (!description) return "";
  return description
    .map((item) => {
      if (item.type === "heading") {
        if (item.level == 1) {
          return `<h${
            item.level
          } class='text-xs sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl py-2 md:py-3 text-left'>
            ${item.children.map(renderChild).join("")}
            </h${item.level}>`;
        } else if (item.level == 2) {
          return `<h${
            item.level
          } class='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl py-2 md:py-3 text-left'>
            ${item.children.map(renderChild).join("")}
            </h${item.level}>`;
        } else if (item.level == 3) {
          return `<h${
            item.level
          } class='text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl py-2 md:py-3 text-left'>
            ${item.children.map(renderChild).join("")}
            </h${item.level}>`;
        } else if (item.level == 4) {
          return `<h${
            item.level
          } class='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-2 md:py-3 text-left'>
            ${item.children.map(renderChild).join("")}
            </h${item.level}>`;
        } else if (item.level == 5) {
          return `<h${
            item.level
          } class='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl py-2 md:py-3 text-left'>
            ${item.children.map(renderChild).join("")}
            </h${item.level}>`;
        } else if (item.level == 6) {
          return `<h${
            item.level
          } class='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-xl py-2 md:py-3 text-left'>
            ${item.children.map(renderChild).join("")}
            </h${item.level}>`;
        }
      } else if (item.type === "paragraph") {
        return `<p class='mb-2 md:mb-4'>${item.children
          .map(renderChild)
          .join("")}</p>`;
      } else if (item.type === "list") {
        return renderList(item);
      } else if (item.type === "quote") {
        return `<p class='border-l-4 pl-2 my-0 border-gray-700 italic'>${item.children
          .map((child) => child.text)
          .join("")}</p>`;
      } else if (item.type === "image") {
        return renderImage(item.image);
      }
      return "";
    })
    .join("");
};
const renderChild = (child) => {
  let text = child.text || "";
  if (child.bold) text = `<strong>${text}</strong>`;
  if (child.italic) text = `<em>${text}</em>`;
  if (child.underline) text = `<u>${text}</u>`;
  if (child.strikethrough) text = `<s>${text}</s>`;
  if (child.type === "link") {
    return `<a href="${
      child.url
    }" target="_blank" class="text-blue-500 underline">
              ${child.children.map(renderChild).join("")}
            </a>`;
  } else if (child.type === "image") {
    return `<img src="${child.url}" alt="${child.alt || "Image"}" class="" />`;
  } else if (child.type === "video") {
    return `<video controls class="my-3">
              <source src="${child.url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>`;
  }
  return text;
};

const renderList = (item) => {
  const listType = item.format === "unordered" ? "ul" : "ol";
  return `<${listType} class="list-disc ml-5">${item.children
    .map(renderListItem)
    .join("")}</${listType}>`;
};

const renderListItem = (listItem) => {
  return `<li>${listItem.children.map(renderChild).join("")}</li>`;
};

const renderImage = (image) => {
  const imageUrl = image.url.startsWith("http")
    ? image.url
    : `http://localhost:1337${image.url}`;
  const altText = image.alternativeText || "Image";

  return `<div class="my-3">
            <img src="${imageUrl}" alt="${altText}" class="w-full mx-auto h-auto" />
            ${
              image.caption
                ? `<p class="text-center text-sm">${image.caption}</p>`
                : ""
            }
          </div>`;
};
onMounted(() => {
  fextchBlog();
});
</script>
<style></style>
