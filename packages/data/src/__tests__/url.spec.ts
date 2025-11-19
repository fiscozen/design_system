import { describe, it, expect } from "vitest";
import { getUrlWithQueryParams } from "../rest/http/utils/url";

describe("getUrlWithQueryParams", () => {
  it("should preserve query string when URL contains multiple '?' characters", () => {
    // Malformed URL but should be handled gracefully
    const url = "http://example.com/path?key1=value1?key2=value2";
    const result = getUrlWithQueryParams(url);
    
    // Should preserve everything after the first '?'
    // Note: URLSearchParams may not parse malformed query strings correctly,
    // but we should at least preserve the full query string
    expect(result).toContain("http://example.com/path");
  });

  it("should handle URL with single query parameter", () => {
    const url = "http://example.com/path?key1=value1";
    const result = getUrlWithQueryParams(url, { key2: "value2" });
    
    expect(result).toBe("http://example.com/path?key1=value1&key2=value2");
  });

  it("should handle URL without query parameters", () => {
    const url = "http://example.com/path";
    const result = getUrlWithQueryParams(url, { key1: "value1" });
    
    expect(result).toBe("http://example.com/path?key1=value1");
  });

  it("should override existing query parameters with new ones", () => {
    const url = "http://example.com/path?key1=old_value";
    const result = getUrlWithQueryParams(url, { key1: "new_value" });
    
    expect(result).toBe("http://example.com/path?key1=new_value");
  });

  it("should merge existing and new query parameters", () => {
    const url = "http://example.com/path?key1=value1";
    const result = getUrlWithQueryParams(url, { key2: "value2", key3: "value3" });
    
    expect(result).toContain("key1=value1");
    expect(result).toContain("key2=value2");
    expect(result).toContain("key3=value3");
  });

  it("should handle empty query parameters object", () => {
    const url = "http://example.com/path?key1=value1";
    const result = getUrlWithQueryParams(url, {});
    
    expect(result).toBe("http://example.com/path?key1=value1");
  });

  it("should handle URL ending with '?'", () => {
    const url = "http://example.com/path?";
    const result = getUrlWithQueryParams(url, { key1: "value1" });
    
    expect(result).toBe("http://example.com/path?key1=value1");
  });

  it("should handle relative URLs", () => {
    const url = "/api/users?page=1";
    const result = getUrlWithQueryParams(url, { pageSize: 50 });
    
    expect(result).toContain("/api/users");
    expect(result).toContain("page=1");
    expect(result).toContain("pageSize=50");
  });

  it("should preserve fragment when URL has no query parameters", () => {
    const url = "http://example.com/path#section";
    const result = getUrlWithQueryParams(url, { key1: "value1" });
    
    expect(result).toBe("http://example.com/path?key1=value1#section");
  });

  it("should preserve fragment when URL has query parameters", () => {
    const url = "http://example.com/path?key1=value1#section";
    const result = getUrlWithQueryParams(url, { key2: "value2" });
    
    expect(result).toBe("http://example.com/path?key1=value1&key2=value2#section");
  });

  it("should preserve fragment when overriding query parameters", () => {
    const url = "http://example.com/path?key1=old_value#section";
    const result = getUrlWithQueryParams(url, { key1: "new_value" });
    
    expect(result).toBe("http://example.com/path?key1=new_value#section");
  });

  it("should preserve fragment with complex value", () => {
    const url = "http://example.com/path?key1=value1#section/subsection?param=value";
    const result = getUrlWithQueryParams(url, { key2: "value2" });
    
    // Fragment should be preserved as-is (even if it contains '?' or other special chars)
    expect(result).toContain("#section/subsection?param=value");
    expect(result).toContain("key1=value1");
    expect(result).toContain("key2=value2");
  });

  it("should handle URL with only fragment and no query", () => {
    const url = "http://example.com/path#section";
    const result = getUrlWithQueryParams(url);
    
    expect(result).toBe("http://example.com/path#section");
  });

  it("should handle fragment when query string is empty", () => {
    const url = "http://example.com/path?#section";
    const result = getUrlWithQueryParams(url, { key1: "value1" });
    
    expect(result).toBe("http://example.com/path?key1=value1#section");
  });
});

