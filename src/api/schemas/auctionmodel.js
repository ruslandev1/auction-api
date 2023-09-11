export default {
  type: "object",
  properties: {
    totalCount: { type: "number" },
    title: { type: "string" },
    image: { type: "string" },
    imageUrl: { type: "string" },
    status: { type: "boolean" },
    date: { type: "string", format: "date-time" },
    organizerId: { type: "number" },
    organizer: { type: "string" },
    isDeleted: { type: "boolean" },
    createdDate: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["totalCount", "title", "imageUrl", "status", "organizerId"],
  additionalProperties: false,
};
