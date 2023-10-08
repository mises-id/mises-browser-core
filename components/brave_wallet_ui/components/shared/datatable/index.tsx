/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from 'react'
// import { CSSProperties } from 'styled-components'

import {
  StyledWrapper,
  StyledTH,
  StyledNoContent,
  StyledTable,
  StyledTHead,
  StyledTBody,
  StyledTD,
  ArrowDown,
  ArrowUp,
  ArrowWrapper,
  StyledTR
} from './style'

import { SortOrder } from '../../../constants/types'
import { ViewStyle } from 'react-native'

export interface Header {
  id: string
  customStyle?: ViewStyle
  content: React.ReactNode
  sortable?: boolean
  sortOrder?: SortOrder
}
export interface Cell {
  customStyle?: ViewStyle
  content: React.ReactNode
}

export interface Row {
  id: string
  customStyle?: ViewStyle
  content: Cell[]
  data: any
  onClick?: (data: any) => void
}

export interface Props {
  id?: string
  headers?: Header[]
  children?: React.ReactNode
  rows?: Row[]
  rowTheme?: { [key: string]: string }
  stickyHeaders?: boolean
  onSort?: (column: string, newSortOrder: SortOrder) => void
}

export const Table = (props: Props) => {
  const { id, headers, rows, children, stickyHeaders, onSort } = props

  const onHeaderClick = React.useCallback((header: Header) => () => {
    if (!header.sortable) return
    const currentSortOrder = header.sortOrder ?? 'desc'
    const newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'

    if (onSort) {
      onSort(header.id, newSortOrder)
    }
  }, [onSort])

  const onRowClick = React.useCallback((row: Row) => () => {
    if (row.onClick) {
      row.onClick(row.data)
    }
  }, [])

  return (
    <StyledWrapper>
      {headers && headers.length > 0 &&
        <StyledTable>
          {headers &&
            <StyledTHead>
              <tr>
                {
                  headers.map((header) =>
                    <StyledTH
                      key={`${header.id}-th`}
                      style={header.customStyle}
                      sortable={header.sortable}
                      sortOrder={header.sortOrder}
                      onPress={onHeaderClick(header)}
                      stickyHeaders={stickyHeaders}
                    >
                      {header.sortable &&
                        <ArrowWrapper>
                          {header.sortOrder === 'asc' ? <ArrowUp /> : null}
                          {header.sortOrder === 'desc' ? <ArrowDown /> : null}
                        </ArrowWrapper>
                      }
                      {header.content}
                    </StyledTH>
                  )
                }
              </tr>
            </StyledTHead>
          }
          {rows &&
            <StyledTBody>
              {
                rows.map((row: Row, i: number) =>
                  <StyledTR
                    key={`tr-${row.id}-${i}`}
                    style={row.customStyle}
                  >
                    {
                      row.content.map((cell: Cell, j: number) =>
                        <StyledTD
                          key={`${id}-td-${i}-${j}`}
                          style={cell.customStyle}
                          onPress={onRowClick(row)}
                        >
                          {cell.content}
                        </StyledTD>
                      )
                    }
                  </StyledTR>
                )
              }
            </StyledTBody>
          }
        </StyledTable>
      }
      {(!rows || rows.length === 0) &&
        <StyledNoContent>
          {children}
        </StyledNoContent>
      }
    </StyledWrapper>
  )
}
