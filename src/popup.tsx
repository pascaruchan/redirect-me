import { useState, useEffect } from "react"
import type { Rule } from "./types"
import { getRules, toggleRule } from "./utils/ruleManager"

function IndexPopup() {
  const [rules, setRules] = useState<Rule[]>([])

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    const loadedRules = await getRules()
    setRules(loadedRules)
  }

  const handleToggleRule = async (ruleId: string) => {
    await toggleRule(ruleId)
    loadRules()
  }

  return (
    <div style={{ width: "400px", padding: "16px" }}>
      <h1>Redirect Me</h1>
      <div style={{ marginBottom: "16px" }}>
        <a href="options.html" target="_blank" style={{ color: "blue" }}>
          Manage Rules
        </a>
      </div>
      <div>
        <h2>Active Rules</h2>
        {rules.length === 0 ? (
          <p>No rules defined. Click "Manage Rules" to create some.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {rules.map((rule) => (
              <li
                key={rule.id}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{rule.name}</strong>
                  <p style={{ margin: "4px 0", fontSize: "0.9em" }}>
                    {rule.description}
                  </p>
                </div>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={() => handleToggleRule(rule.id)}
                    style={{ marginRight: "8px" }}
                  />
                  Active
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default IndexPopup
