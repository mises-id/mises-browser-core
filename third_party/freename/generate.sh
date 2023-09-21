# curl --location 'https://api.freename.io/item/get-all-tlds' \
# -o freename_tld.json \
# --header 'Content-Type: application/json' \
# --data '{
#     "filters": [],
#     "limit": 10000,
#     "offset": 0,
#     "order": "date_DESC"
# }'


cat freename_tld.json | jq -c '.data.elements | select( all(.[]; .existingDomainsCount > 0))|=sort_by(.name) |to_entries[]|.value.name[1:]' --raw-output > freename_tld.dat
../../src/out/Debug_arm64/tld_cleanup
python fn_make_dafsa.py --reverse freename_tld.gperf freename_tld_names-reversed-inc.cc

python fn_make_dafsa.py --binary --reverse freename_tld.gperf freename_tld_names-reversed-inc.dat