"use client";

import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchField = ({ value, onChange, placeholder }: Props) => {
  return (
    <TextField
      size="small"
      value={value}
      placeholder={placeholder || "Search..."}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: 300 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchField;