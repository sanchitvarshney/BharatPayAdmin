import { useCallback, useEffect, useState } from "react";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "@/hooks/useReduxHook";
import { getAwbList } from "@/features/awb/awbSlice";
import { Icons } from "@/components/icons/icons";
import AwbListTable from "@/components/table/awb/AwbListTable";

const AwbCount = () => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchList = useCallback(() => {
    dispatch(getAwbList({ page, limit, search: search || undefined }));
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-[60px] flex items-center justify-between px-[20px] border-b">
        <Typography variant="h6" fontWeight={600}>
          AWB Count
        </Typography>
        <div className="flex items-center gap-[15px]">
          <TextField
            size="small"
            variant="filled"
            placeholder="Search AWB No"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Icons.search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
         
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <AwbListTable
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setPage(1);
            setLimit(l);
          }}
          onUpdated={fetchList}
        />
      </div>
    </div>
  );
};

export default AwbCount;
