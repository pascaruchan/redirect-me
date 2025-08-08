import { useEffect, useState } from "react"

import type { Rule, TransformationRule } from "./types"
import { TransformationType } from "./types"
import {
  addRule,
  deleteRule,
  getRules,
  toggleRule,
  updateRule
} from "./utils/ruleManager"

function IndexOptions() {
  const [rules, setRules] = useState<Rule[]>([])
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    const loadedRules = await getRules()
    setRules(loadedRules)
  }

  const handleAddRule = async () => {
    setEditingRule({
      id: "",
      name: "",
      description: "",
      inputPattern: "",
      outputPattern: "",
      transformationRules: [],
      isActive: true
    })
    setShowForm(true)
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setShowForm(true)
  }

  const handleSaveRule = async () => {
    if (!editingRule) return

    if (editingRule.id) {
      await updateRule(editingRule)
    } else {
      await addRule(editingRule)
    }

    setShowForm(false)
    setEditingRule(null)
    loadRules()
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await deleteRule(ruleId)
      loadRules()
    }
  }

  const handleToggleRule = async (ruleId: string) => {
    await toggleRule(ruleId)
    loadRules()
  }

  const addTransformationRule = () => {
    if (!editingRule) return

    setEditingRule({
      ...editingRule,
      transformationRules: [
        ...editingRule.transformationRules,
        {
          type: TransformationType.ReplaceAll,
          searchValue: "",
          replaceValue: "",
          target: 1
        }
      ]
    })
  }

  const updateTransformationRule = (
    index: number,
    field: keyof TransformationRule,
    value: string | number
  ) => {
    if (!editingRule) return

    const updatedRules = [...editingRule.transformationRules]
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value
    }

    setEditingRule({
      ...editingRule,
      transformationRules: updatedRules
    })
  }

  const removeTransformationRule = (index: number) => {
    if (!editingRule) return

    setEditingRule({
      ...editingRule,
      transformationRules: editingRule.transformationRules.filter(
        (_, i) => i !== index
      )
    })
  }

  return (
    <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Redirect Me - Rule Management</h1>

      {showForm && editingRule && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
            <h2>{editingRule.id ? "Edit Rule" : "New Rule"}</h2>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Name:
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box"
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Description:
                <textarea
                  value={editingRule.description}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      description: e.target.value
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    minHeight: "60px",
                    boxSizing: "border-box"
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Input Pattern (RegExp):
                <input
                  type="text"
                  value={editingRule.inputPattern}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      inputPattern: e.target.value
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box"
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Output Pattern:
                <input
                  type="text"
                  value={editingRule.outputPattern}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      outputPattern: e.target.value
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box"
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3>Transformation Rules</h3>
              {editingRule.transformationRules.map((rule, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    padding: "16px",
                    marginBottom: "16px",
                    borderRadius: "4px"
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                    <h4>Rule {index + 1}</h4>
                    <button
                      onClick={() => removeTransformationRule(index)}
                      style={{ color: "red" }}>
                      Remove
                    </button>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                      Type:
                      <select
                        value={rule.type}
                        onChange={(e) =>
                          updateTransformationRule(
                            index,
                            "type",
                            e.target.value as TransformationType
                          )
                        }
                        style={{ width: "100%", padding: "8px" }}>
                        {Object.values(TransformationType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                      Search Value:
                      <input
                        type="text"
                        value={rule.searchValue}
                        onChange={(e) =>
                          updateTransformationRule(
                            index,
                            "searchValue",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxSizing: "border-box"
                        }}
                      />
                    </label>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                      Replace Value:
                      <input
                        type="text"
                        value={rule.replaceValue}
                        onChange={(e) =>
                          updateTransformationRule(
                            index,
                            "replaceValue",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxSizing: "border-box"
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                      Target Group:
                      <input
                        type="number"
                        value={rule.target}
                        onChange={(e) =>
                          updateTransformationRule(
                            index,
                            "target",
                            parseInt(e.target.value)
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxSizing: "border-box"
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
              <button
                onClick={addTransformationRule}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>
                Add Transformation Rule
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px"
              }}>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingRule(null)
                }}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={handleAddRule}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Add New Rule
        </button>
      </div>

      <div>
        {rules.length === 0 ? (
          <p>No rules defined. Click "Add New Rule" to create one.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {rules.map((rule) => (
              <li
                key={rule.id}
                style={{
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h3>{rule.name}</h3>
                    <p>{rule.description}</p>
                    <p>
                      <strong>Input Pattern:</strong> {rule.inputPattern}
                    </p>
                    <p>
                      <strong>Output Pattern:</strong> {rule.outputPattern}
                    </p>
                    {rule.transformationRules.length > 0 && (
                      <div>
                        <strong>Transformations:</strong>
                        <ul>
                          {rule.transformationRules.map((t, i) => (
                            <li key={i}>
                              {t.type} on group {t.target}: "{t.searchValue}" →
                              "{t.replaceValue}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}>
                    <label style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={() => handleToggleRule(rule.id)}
                        style={{ marginRight: "8px" }}
                      />
                      Active
                    </label>
                    <button
                      onClick={() => handleEditRule(rule)}
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "red"
                      }}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default IndexOptions
