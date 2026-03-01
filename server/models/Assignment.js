const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    columnName: { type: String, required: true },
    dataType: { type: String, required: true },
  },
  { _id: false }
);

const sampleTableSchema = new mongoose.Schema(
  {
    tableName: { type: String, required: true },
    columns: [columnSchema],
    rows: [mongoose.Schema.Types.Mixed],
  },
  { _id: false }
);

const expectedOutputSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["table", "single_value", "column", "count", "row"],
      required: true,
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    category: { type: String, required: true },
    description: { type: String, required: true },
    question: { type: String, required: true },
    sampleTables: [sampleTableSchema],
    expectedOutput: expectedOutputSchema,
    hints: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
