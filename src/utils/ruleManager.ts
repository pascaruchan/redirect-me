import type { Rule, RuleStorage } from "../types";

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const getRules = async (): Promise<Rule[]> => {
  return new Promise((resolve) => {
    chrome.storage.local.get((storage) => {
      const ruleStorage = storage as RuleStorage;
      resolve(ruleStorage.rules || []);
    });
  });
};

export const saveRules = async (rules: Rule[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ rules }, () => resolve());
  });
};

export const addRule = async (rule: Omit<Rule, "id">): Promise<Rule> => {
  const newRule: Rule = {
    ...rule,
    id: generateId()
  };
  const rules = await getRules();
  await saveRules([...rules, newRule]);
  return newRule;
};

export const updateRule = async (rule: Rule): Promise<void> => {
  const rules = await getRules();
  const index = rules.findIndex((r) => r.id === rule.id);
  if (index !== -1) {
    rules[index] = rule;
    await saveRules(rules);
  }
};

export const deleteRule = async (ruleId: string): Promise<void> => {
  const rules = await getRules();
  await saveRules(rules.filter((rule) => rule.id !== ruleId));
};

export const toggleRule = async (ruleId: string): Promise<void> => {
  const rules = await getRules();
  const rule = rules.find((r) => r.id === ruleId);
  if (rule) {
    rule.isActive = !rule.isActive;
    await updateRule(rule);
  }
}; 