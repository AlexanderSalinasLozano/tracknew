function dtcOpen() {
    utilsCheckPrivileges("dtc") && ($("#dialog_dtc").bind("resize", function() {
        $("#dtc_list_grid").setGridHeight($("#dialog_dtc").height() - 133)
    }).trigger("resize"), $("#dialog_dtc").bind("resize", function() {
        $("#dtc_list_grid").setGridWidth($("#dialog_dtc").width())
    }).trigger("resize"), $("#dialog_dtc").dialog("open"))
}

function dtcClose() {
    $("#dialog_dtc").unbind("resize")
}

function dtcShow() {
    var e = "func/fn_dtc.php?cmd=load_dtc_list",
        t = document.getElementById("dialog_dtc_object_list").value,
        a = document.getElementById("dialog_dtc_date_from").value + " " + document.getElementById("dialog_dtc_hour_from").value + ":" + document.getElementById("dialog_dtc_minute_from").value + ":00",
        o = document.getElementById("dialog_dtc_date_to").value + " " + document.getElementById("dialog_dtc_hour_to").value + ":" + document.getElementById("dialog_dtc_minute_to").value + ":00";
    "" != t && (e += "&imei=" + t), a != o && (e += "&dtf=" + a + "&dtt=" + o), $("#dtc_list_grid").jqGrid("setGridParam", {
        url: e
    }).trigger("reloadGrid")
}

function dtcDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_record",
                dtc_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_dtc.php",
                data: a,
                success: function(e) {
                    "OK" == e && dtcShow()
                }
            })
        }
    })
}

function dtcDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#dtc_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_records",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_dtc.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && dtcShow()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function dtcDeleteAll() {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_DTC_RECORDS, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_records"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_dtc.php",
                data: t,
                success: function(e) {
                    "OK" == e && dtcShow()
                }
            })
        }
    })
}

function dtcExportCSV() {
    var e = "func/fn_export.php?format=dtc_csv",
        t = document.getElementById("dialog_dtc_object_list").value,
        a = document.getElementById("dialog_dtc_date_from").value + " " + document.getElementById("dialog_dtc_hour_from").value + ":" + document.getElementById("dialog_dtc_minute_from").value + ":00",
        o = document.getElementById("dialog_dtc_date_to").value + " " + document.getElementById("dialog_dtc_hour_to").value + ":" + document.getElementById("dialog_dtc_minute_to").value + ":00";
    "" != t && (e += "&imei=" + t), a != o && (e += "&dtf=" + a + "&dtt=" + o), window.location = e
}

function billingOpen() {
    utilsCheckPrivileges("subuser") && $("#dialog_billing").dialog("open")
}

function billingClose() {}

function billingLoadData() {
    clearTimeout(timer_billingLoadData), timer_billingLoadData = setTimeout("billingLoadData();", 1e3 * gsValues.billing_refresh), billingUpdateCount(), 1 == $("#dialog_billing").dialog("isOpen") && billingReload()
}

function billingReload() {
    $("#billing_plan_list_grid").trigger("reloadGrid")
}

function billingUpdateCount() {
    var e = {
        cmd: "get_billing_plan_total_objects"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_billing.php",
        data: e,
        dataType: "json",
        cache: !1,
        success: function(e) {
            void 0 != document.getElementById("billing_plan_count") && (document.getElementById("billing_plan_count").innerHTML = e.objects)
        }
    })
}

function billingPlanPurchase() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) {
        var e = {
            cmd: "load_billing_plan_purchase_list"
        };
        $.ajax({
            type: "POST",
            url: "func/fn_billing.php",
            data: e,
            cache: !1,
            success: function(e) {
                "" == e ? notifyBox("error", la.ERROR, la.NO_BILLING_PLANS_FOUND) : (document.getElementById("billing_plan_purchase_list").innerHTML = e, $("#dialog_billing_plan_purchase").dialog("open"))
            }
        })
    }
}

function billingPlanUse(e) {
    if (utilsCheckPrivileges("subuser")) {
        billingPlanUseObjectLoadList();
        var t = {
            cmd: "load_billing_plan",
            plan_id: e
        };
        $.ajax({
            type: "POST",
            url: "func/fn_billing.php",
            data: t,
            dataType: "json",
            cache: !1,
            success: function(e) {
                if (billingData.plan = e, document.getElementById("dialog_billing_plan_use_objects").innerHTML = billingData.plan.objects, 1 == billingData.plan.period) t = la[billingData.plan.period_type.slice(0, -1).toUpperCase()];
                else var t = la[billingData.plan.period_type.toUpperCase()];
                var a = billingData.plan.period + " " + t.toLowerCase();
                document.getElementById("dialog_billing_plan_use_period").innerHTML = a, document.getElementById("dialog_billing_plan_use_selected").innerHTML = 0, $("#dialog_billing_plan_use").dialog("option", "title", la.BILLING_PLAN + " - " + billingData.plan.name), $("#dialog_billing_plan_use").dialog("open")
            }
        })
    }
}

function billingPlanUseObjectLoadList() {
    var e = $("#billing_plan_object_list_grid");
    e.clearGridData(!0);
    for (var t in settingsObjectData) {
        var a = settingsObjectData[t],
            o = a.name.toLowerCase(),
            i = a.name,
            s = a.active,
            n = a.object_expire,
            l = a.object_expire_dt;
        s = "true" == s ? '<img src="theme/images/tick-green.svg" />' : '<img src="theme/images/remove-red.svg" style="width:12px;" />', "true" == n && e.jqGrid("addRowData", t, {
            name_sort: o,
            name: i,
            imei: t,
            active: s,
            object_expire_dt: l
        })
    }
    e.setGridParam({
        sortname: "name_sort",
        sortorder: "asc"
    }).trigger("reloadGrid")
}

function billingPlanUseUpdateSelection() {
    var e = $("#billing_plan_object_list_grid").jqGrid("getGridParam", "selarrrow"),
        t = e.length;
    t > billingData.plan.objects ? (document.getElementById("dialog_billing_plan_use_objects").innerHTML = 0, document.getElementById("dialog_billing_plan_use_selected").innerHTML = e.length + ' <font color="red">(' + la.TOO_MANY + ")</font>") : (document.getElementById("dialog_billing_plan_use_objects").innerHTML = billingData.plan.objects - t, document.getElementById("dialog_billing_plan_use_selected").innerHTML = e.length)
}

function billingPlanUseActivate() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) {
        var e = $("#billing_plan_object_list_grid").jqGrid("getGridParam", "selarrrow");
        if ("" != e) {
            var t = e.length;
            if (t > billingData.plan.objects) notifyBox("error", la.ERROR, la.TOO_MANY_OBJECTS_SELECTED);
            else {
                var a = !1;
                for (i = 0; i < t; i++) {
                    var o = e[i];
                    if ("true" == settingsObjectData[o].active) {
                        a = !0;
                        break
                    }
                }
                var s = la.ARE_YOU_SURE_YOU_WANT_TO_ACTIVATE_SELECTED_OBJECTS;
                a && (s = la.THERE_ARE_STILL_ACTIVE_OBJECTS + " " + s), confirmDialog(s, function(a) {
                    if (a) {
                        var o = JSON.stringify(e),
                            i = {
                                cmd: "use_billing_plan",
                                plan: billingData.plan,
                                imeis: o
                            };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_billing.php",
                            data: i,
                            cache: !1,
                            success: function(e) {
                                "OK" == e ? (loadSettings("objects", function() {
                                    objectReloadData(), billingReload(), billingPlanUseObjectLoadList(), billingUpdateCount(), billingData.plan.objects -= t, billingPlanUseUpdateSelection()
                                }), notifyBox("info", la.INFORMATION, la.OBJECTS_ACTIVATED_SUCCESSFULLY)) : "ERROR_VERIFY" == e ? notifyBox("error", la.ERROR, la.PLAN_VERIFICATION_FAILED) : "ERROR_ACTIVATE" == e && notifyBox("error", la.ERROR, la.OBJECT_ACTIVATION_FAILED)
                            }
                        })
                    }
                })
            }
        } else notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function billingPlanDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_billing_plan",
                plan_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_billing.php",
                data: a,
                success: function(e) {
                    "OK" == e && billingReload()
                }
            })
        }
    })
}

function chatOpen() {
    utilsCheckPrivileges("chat") && ($("#dialog_chat").bind("resize", function() {
        scrollToBottom("chat_msgs")
    }), $("#dialog_chat").bind("resize", function() {
        $("#chat_object_list_grid").setGridHeight($("#dialog_chat").height() - 84)
    }).trigger("resize"), $("#dialog_chat").dialog("open"), $("#chat_msgs").scroll(chatMsgsScrollHandler), chatLoadObjectList())
}

function chatClose() {
    chatData.imei = !1, chatData.first_msg_id = !1, chatData.last_msg_id = !1, document.getElementById("chat_msg").enable = !0, chatClear(), $("#dialog_chat").unbind("resize"), $("#chat_msgs").off("scroll", chatMsgsScrollHandler)
}

function chatClear() {
    document.getElementById("chat_msgs_dt").style.display = "none", document.getElementById("chat_msgs_dt").innerHTML = "", document.getElementById("chat_msgs_text").innerHTML = "", document.getElementById("chat_msg_status").innerHTML = "", document.getElementById("chat_msg").value = ""
}

function chatLoadData() {
    clearTimeout(timer_chatLoadData);
    var e = {
        cmd: "load_chat_data",
        imei: chatData.imei,
        last_msg_id: chatData.last_msg_id
    };
    $.ajax({
        type: "POST",
        url: "func/fn_chat.php",
        data: e,
        dataType: "json",
        error: function(e, t) {
            timer_chatLoadData = setTimeout("chatLoadData();", 1e3 * gsValues.chat_refresh)
        },
        success: function(e) {
            chatData.msg_count = e.msg_count, chatData.msg_dt = e.msg_dt, chatUpdateMsgCount(), chatUpdateMsgDt(), 0 != e.last_msg_status && chatUpdateMsgDeliveryStatus(e.last_msg_status);
            var t = chatData.imei;
            void 0 != chatData.msg_count[t] && chatLoadMsgs("new"), timer_chatLoadData = setTimeout("chatLoadData();", 1e3 * gsValues.chat_refresh)
        }
    })
}

function chatReloadData() {
    chatLoadObjectList(), chatLoadData()
}

function chatIsObjectCompatible(e) {
    return "" != objectsData[e].data && null != objectsData[e].data[0].params && void 0 != objectsData[e].data[0].params.chat
}

function chatLoadObjectList() {
    var e = $("#chat_object_list_grid");
    e.clearGridData(!0);
    for (var t in settingsObjectData) {
        var a = settingsObjectData[t];
        if ("true" == a.active && chatIsObjectCompatible(t)) {
            var o = '<img src="' + a.icon + '" style="width: 26px;"/>',
                i = '<div class="object-list-item"><div class="left"><div class="name">' + a.name + '</div><div class="status" id="chat_object_msg_status_' + t + '">' + la.NO_MESSAGES + "</div></div>";
            i += '<div class="right" id="chat_object_msg_count_' + t + '"></div></div>', e.jqGrid("addRowData", t, {
                search: a.name.toLowerCase(),
                icon: o,
                name: i
            })
        }
    }
    e.setGridParam({
        sortname: "search",
        sortorder: "asc"
    }).trigger("reloadGrid")
}

function chatUpdateMsgCount() {
    var e = 0;
    if (null != document.getElementById("chat_msg_count")) {
        for (var t in chatData.msg_count) chatIsObjectCompatible(t) && (e += chatData.msg_count[t]);
        e > 0 && "0" == document.getElementById("chat_msg_count").innerHTML && "" != settingsUserData.chat_notify && new Audio("snd/" + settingsUserData.chat_notify).play(), document.getElementById("chat_msg_count").innerHTML = e, document.title = e > 0 ? gsValues.title + " (" + e + ")" : gsValues.title;
        for (var t in settingsObjectData) null != document.getElementById("chat_object_msg_count_" + t) && (void 0 != chatData.msg_count[t] ? document.getElementById("chat_object_msg_count_" + t).innerHTML = '<div class="messages">' + chatData.msg_count[t] + "</div>" : document.getElementById("chat_object_msg_count_" + t).innerHTML = "")
    }
}

function chatUpdateMsgDt() {
    for (var e in chatData.msg_dt)
        if (null != document.getElementById("chat_object_msg_count_" + e)) {
            var t = chatData.msg_dt[e];
            document.getElementById("chat_object_msg_status_" + e).innerHTML = "" == t ? la.NO_MESSAGES : t
        }
}

function chatDeleteAllMsgs() {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_SELECTED_OBJECT_MESSAGES, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_msgs",
                imei: chatData.imei
            };
            $.ajax({
                type: "POST",
                url: "func/fn_chat.php",
                data: t,
                success: function(e) {
                    if ("OK" == e) {
                        chatClear();
                        var t = chatData.imei;
                        chatData.msg_dt[t] = "", chatUpdateMsgDt()
                    }
                }
            })
        }
    })
}

function chatSend() {
    var e = document.getElementById("chat_msg").value;
    if (0 != chatData.imei && "" != e) {
        e = stripHTML(e), e = strLink(e);
        var t = {
            cmd: "send_msg",
            imei: chatData.imei,
            msg: e
        };
        $.ajax({
            type: "POST",
            url: "func/fn_chat.php",
            data: t,
            cache: !1,
            success: function(e) {
                "OK" == e && (document.getElementById("chat_msg").value = "", chatLoadMsgs("new"))
            },
            error: function(e, t) {}
        })
    }
}

function chatLoadMsgs(e) {
    if ("old" == e) t = 10;
    else var t = 40;
    var a = {
        cmd: "load_msgs",
        type: e,
        imei: chatData.imei,
        msg_limit: t,
        first_msg_id: chatData.first_msg_id,
        last_msg_id: chatData.last_msg_id
    };
    $.ajax({
        type: "POST",
        url: "func/fn_chat.php",
        data: a,
        dataType: "json",
        cache: !1,
        success: function(t) {
            if ("" != t) {
                "old" == e && (document.getElementById("chat_msgs").scrollTop = 1);
                var a = "";
                for (var o in t) {
                    var i = t[o = parseInt(o)].dt,
                        s = t[o].s,
                        n = t[o].m,
                        l = t[o].st;
                    a += chatFormatMsg(o, i, s, n), (chatData.first_msg_id > o || 0 == chatData.first_msg_id) && (chatData.first_msg_id = o), (chatData.last_msg_id < o || 0 == chatData.last_msg_id) && (chatData.last_msg_id = o)
                }
                if ("old" != e) {
                    document.getElementById("chat_msgs_text").innerHTML = document.getElementById("chat_msgs_text").innerHTML + a, scrollToBottom("chat_msgs");
                    var r = chatData.imei,
                        s = t[o = chatData.last_msg_id].s,
                        l = t[o].st;
                    chatUpdateMsgDeliveryStatus("S" == s ? l : 0), delete chatData.msg_count[r], chatUpdateMsgCount();
                    i = t[o].dt;
                    chatData.msg_dt[r] = i, chatUpdateMsgDt()
                } else document.getElementById("chat_msgs_text").innerHTML = a + document.getElementById("chat_msgs_text").innerHTML
            }
        },
        error: function(e, t) {}
    })
}

function chatFormatMsg(e, t, a, o) {
    if ("S" == a) var i = "chat-msg-server",
        s = "chat-msg-dt-server";
    else var i = "chat-msg-client",
        s = "chat-msg-dt-client";
    return t.substring(0, 10) == moment().format("YYYY-MM-DD") && (t = t.substring(11, 19)), '<div class="chat-msg-container"><div title="' + t + '" class="' + i + '">' + o + '<div class="' + s + '">' + t + "</div></div></div>"
}

function chatUpdateMsgDeliveryStatus(e) {
    var t = !1;
    0 == e ? document.getElementById("chat_msg_status").innerHTML = "" : 1 == e ? ("" == document.getElementById("chat_msg_status").innerHTML && (t = !0), document.getElementById("chat_msg_status").innerHTML = la.DELIVERED) : 2 == e && ("" == document.getElementById("chat_msg_status").innerHTML && (t = !0), document.getElementById("chat_msg_status").innerHTML = la.SEEN), t && scrollToBottom("chat_msgs")
}

function chatSelectObject(e) {
    chatData.imei != e && (chatClear(), document.getElementById("chat_msg").enable = !1, chatData.imei = e, chatData.first_msg_id = !1, chatData.last_msg_id = !1, chatLoadMsgs("select"))
}

function imgOpen() {
    utilsCheckPrivileges("image_gallery") && ($("#dialog_image_gallery").dialog("open"), imgLoadData())
}

function imgLoadData() {
    clearTimeout(timer_imgLoadData), timer_imgLoadData = setTimeout("imgLoadData();", 1e3 * gsValues.img_refresh), 1 == $("#dialog_image_gallery").dialog("isOpen") ? $("#image_gallery_list_grid").trigger("reloadGrid") : clearTimeout(timer_imgLoadData)
}

function imgFilter() {
    var e = "func/fn_img.php?cmd=load_img_list",
        t = document.getElementById("dialog_image_gallery_object_list").value,
        a = document.getElementById("dialog_image_gallery_date_from").value + " " + document.getElementById("dialog_image_gallery_hour_from").value + ":" + document.getElementById("dialog_image_gallery_minute_from").value + ":00",
        o = document.getElementById("dialog_image_gallery_date_to").value + " " + document.getElementById("dialog_image_gallery_hour_to").value + ":" + document.getElementById("dialog_image_gallery_minute_to").value + ":00";
    "" != t && (e += "&imei=" + t), a != o && (e += "&dtf=" + a + "&dtt=" + o), $("#image_gallery_list_grid").jqGrid("setGridParam", {
        url: e
    }).trigger("reloadGrid")
}

function imgDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_img",
                img_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_img.php",
                data: a,
                success: function(e) {
                    "OK" == e && (document.getElementById("image_gallery_img").innerHTML = "", document.getElementById("image_gallery_img_data").innerHTML = "", $("#image_gallery_list_grid").trigger("reloadGrid"))
                }
            })
        }
    })
}

function imgDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#image_gallery_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_imgs",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_img.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && (document.getElementById("image_gallery_img").innerHTML = "", document.getElementById("image_gallery_img_data").innerHTML = "", $("#image_gallery_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function imgDeleteAll() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_IMAGES, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_imgs"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_img.php",
                data: t,
                success: function(e) {
                    "OK" == e && (document.getElementById("image_gallery_img").innerHTML = "", document.getElementById("image_gallery_img_data").innerHTML = "", $("#image_gallery_list_grid").trigger("reloadGrid"))
                }
            })
        }
    })
}

function cmdOpen() {
    utilsCheckPrivileges("object_control") && ($("#dialog_cmd").dialog("open"), cmdStatusLoadData(), cmdTemplateList(), cmdScheduleTemplateList())
}

function cmdStatusLoadData() {
    clearTimeout(timer_cmdLoadData), timer_cmdLoadData = setTimeout("cmdStatusLoadData();", 1e3 * gsValues.cmd_status_refresh), 1 == $("#dialog_cmd").dialog("isOpen") ? $("#cmd_status_list_grid").trigger("reloadGrid") : clearTimeout(timer_cmdLoadData)
}

function cmdReset() {
    document.getElementById("cmd_template_list").value = "", document.getElementById("cmd_gateway").value = "gprs", $("#cmd_gateway").multipleSelect("refresh"), document.getElementById("cmd_type").value = "ascii", $("#cmd_type").multipleSelect("refresh"), document.getElementById("cmd_cmd").value = ""
}

function cmdSend() {
    var e = document.getElementById("cmd_object_list").value,
        t = $("#cmd_template_list :selected").text(),
        a = document.getElementById("cmd_gateway").value,
        o = document.getElementById("cmd_type").value,
        i = document.getElementById("cmd_cmd").value;
    cmdCheck() && cmdExec(e, t, a, o, i)
}

function cmdCheck() {
    var e = document.getElementById("cmd_object_list").value,
        t = document.getElementById("cmd_gateway").value,
        a = document.getElementById("cmd_type").value,
        o = document.getElementById("cmd_cmd").value;
    return "" != e && ("" == o ? (notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0), !1) : "sms" == t && "" == settingsObjectData[e].sim_number ? (notifyBox("error", la.ERROR, la.OBJECT_SIM_CARD_NUMBER_IS_NOT_SET, !0), !1) : !("hex" == a && (o = o.toUpperCase(), !isHexValid(o.replace("%IMEI%", "")))) || (notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0), !1))
}

function cmdExec(e, t, a, o, i) {
    if (utilsCheckPrivileges("viewer")) {
        var s = settingsObjectData[e].sim_number;
        "hex" == o && (i = i.toUpperCase()), loadingData(!0);
        var n = {
            cmd: "exec_cmd",
            imei: e,
            name: t,
            gateway: a,
            sim_number: s,
            type: o,
            cmd_: i
        };
        $.ajax({
            type: "POST",
            url: "func/fn_cmd.php",
            data: n,
            success: function(e) {
                loadingData(!1), "OK" == e ? (cmdReset(), $("#cmd_status_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.COMMAND_SENT_FOR_EXECUTION, !0)) : "ERROR_NOT_SENT" == e && ($("#cmd_status_list_grid").trigger("reloadGrid"), notifyBox("error", la.ERROR, la.UNABLE_TO_SEND_SMS_MESSAGE, !0))
            },
            error: function(e, t) {
                loadingData(!1)
            }
        })
    }
}

function cmdExecDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_cmd_exec",
                cmd_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_cmd.php",
                data: a,
                success: function(e) {
                    "OK" == e && $("#cmd_status_list_grid").trigger("reloadGrid")
                }
            })
        }
    })
}

function cmdExecDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#cmd_status_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_cmd_execs",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_cmd.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && $("#cmd_status_list_grid").trigger("reloadGrid")
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function cmdTemplateSwitch() {
    var e = document.getElementById("cmd_template_list").value;
    "" != e ? (document.getElementById("cmd_gateway").value = cmdData.cmd_templates[e].gateway, document.getElementById("cmd_type").value = cmdData.cmd_templates[e].type, document.getElementById("cmd_cmd").value = cmdData.cmd_templates[e].cmd) : (document.getElementById("cmd_gateway").value = "gprs", document.getElementById("cmd_type").value = "ascii", document.getElementById("cmd_cmd").value = ""), $("#cmd_gateway").multipleSelect("refresh"), $("#cmd_type").multipleSelect("refresh")
}

function cmdTemplateList() {
    var e = document.getElementById("cmd_object_list").value;
    if (void 0 != settingsObjectData[e]) {
        var t = settingsObjectData[e].protocol,
            a = document.getElementById("cmd_template_list");
        a.options.length = 0;
        for (var o in cmdData.cmd_templates) {
            var i = cmdData.cmd_templates[o];
            i.protocol.toLowerCase() == t.toLowerCase() ? a.options.add(new Option(i.name, o)) : "" == i.protocol.toLowerCase() && a.options.add(new Option(i.name, o))
        }
        sortSelectList(a), a.options.add(new Option(la.CUSTOM, ""), 0)
    }
    cmdReset()
}

function cmdScheduleProtocolList() {
    var e = document.getElementById("dialog_cmd_schedule_protocol").value,
        t = document.getElementById("dialog_cmd_schedule_protocol");
    t.options.length = 0;
    for (var a = getAllProtocolsArray(), o = 0; o < a.length; o++) "" != a[o] && t.options.add(new Option(a[o], a[o]));
    sortSelectList(t), t.options.add(new Option(la.ALL_PROTOCOLS, ""), 0), document.getElementById("dialog_cmd_schedule_protocol").value = e, $("#dialog_cmd_schedule_protocol").multipleSelect("refresh")
}

function cmdScheduleObjectList() {
    var e = document.getElementById("dialog_cmd_schedule_protocol").value,
        t = document.getElementById("dialog_cmd_schedule_object_list");
    multiselectClear(t);
    var a = getGroupsObjectsArray(e);
    multiselectSetGroups(t, a)
}

function cmdScheduleTemplateList() {
    var e = document.getElementById("dialog_cmd_schedule_protocol").value,
        t = document.getElementById("dialog_cmd_schedule_template_list");
    t.options.length = 0;
    for (var a in cmdData.cmd_templates) {
        var o = cmdData.cmd_templates[a];
        "" == e ? t.options.add(new Option(o.name, a)) : o.protocol.toLowerCase() == e.toLowerCase() && t.options.add(new Option(o.name, a))
    }
    sortSelectList(t), t.options.add(new Option(la.CUSTOM, ""), 0), document.getElementById("dialog_cmd_schedule_template_list").value = "", $("#dialog_cmd_schedule_template_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_gateway").value = "gprs", $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_type").value = "ascii", $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_cmd").value = ""
}

function cmdScheduleSwitchExactTime() {
    1 == document.getElementById("dialog_cmd_schedule_exact_time").checked ? (document.getElementById("dialog_cmd_schedule_exact_time_date").enable = !1, document.getElementById("dialog_cmd_schedule_exact_time_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_mon").enable = !0, document.getElementById("dialog_cmd_schedule_daily_mon_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_tue").enable = !0, document.getElementById("dialog_cmd_schedule_daily_tue_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_wed").enable = !0, document.getElementById("dialog_cmd_schedule_daily_wed_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_thu").enable = !0, document.getElementById("dialog_cmd_schedule_daily_thu_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_fri").enable = !0, document.getElementById("dialog_cmd_schedule_daily_fri_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_sat").enable = !0, document.getElementById("dialog_cmd_schedule_daily_sat_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_sun").enable = !0, document.getElementById("dialog_cmd_schedule_daily_sun_time").enable = !0) : (document.getElementById("dialog_cmd_schedule_exact_time_date").enable = !0, document.getElementById("dialog_cmd_schedule_exact_time_time").enable = !0, document.getElementById("dialog_cmd_schedule_daily_mon").enable = !1, document.getElementById("dialog_cmd_schedule_daily_mon_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_tue").enable = !1, document.getElementById("dialog_cmd_schedule_daily_tue_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_wed").enable = !1, document.getElementById("dialog_cmd_schedule_daily_wed_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_thu").enable = !1, document.getElementById("dialog_cmd_schedule_daily_thu_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_fri").enable = !1, document.getElementById("dialog_cmd_schedule_daily_fri_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_sat").enable = !1, document.getElementById("dialog_cmd_schedule_daily_sat_time").enable = !1, document.getElementById("dialog_cmd_schedule_daily_sun").enable = !1, document.getElementById("dialog_cmd_schedule_daily_sun_time").enable = !1)
}

function cmdScheduleSwitchProtocol() {
    cmdScheduleObjectList(), cmdScheduleTemplateList()
}

function cmdScheduleTemplateSwitch() {
    var e = document.getElementById("dialog_cmd_schedule_template_list").value;
    "" != e ? (document.getElementById("dialog_cmd_schedule_cmd_gateway").value = cmdData.cmd_templates[e].gateway, document.getElementById("dialog_cmd_schedule_cmd_type").value = cmdData.cmd_templates[e].type, document.getElementById("dialog_cmd_schedule_cmd_cmd").value = cmdData.cmd_templates[e].cmd) : (document.getElementById("dialog_cmd_schedule_cmd_gateway").value = "gprs", document.getElementById("dialog_cmd_schedule_cmd_type").value = "ascii", document.getElementById("dialog_cmd_schedule_cmd_cmd").value = ""), $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh")
}

function cmdScheduleResetDailyTime() {
    document.getElementById("dialog_cmd_schedule_daily_mon").checked = !1, document.getElementById("dialog_cmd_schedule_daily_mon_time").value = "00:00", $("#dialog_cmd_schedule_daily_mon_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_tue").checked = !1, document.getElementById("dialog_cmd_schedule_daily_tue_time").value = "00:00", $("#dialog_cmd_schedule_daily_tue_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_wed").checked = !1, document.getElementById("dialog_cmd_schedule_daily_wed_time").value = "00:00", $("#dialog_cmd_schedule_daily_wed_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_thu").checked = !1, document.getElementById("dialog_cmd_schedule_daily_thu_time").value = "00:00", $("#dialog_cmd_schedule_daily_thu_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_fri").checked = !1, document.getElementById("dialog_cmd_schedule_daily_fri_time").value = "00:00", $("#dialog_cmd_schedule_daily_fri_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sat").checked = !1, document.getElementById("dialog_cmd_schedule_daily_sat_time").value = "00:00", $("#dialog_cmd_schedule_daily_sat_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sun").checked = !1, document.getElementById("dialog_cmd_schedule_daily_sun_time").value = "00:00", $("#dialog_cmd_schedule_daily_sun_time").multipleSelect("refresh")
}

function cmdScheduleProperties(e) {
    switch (e) {
        default:
            var t = e;
            cmdData.edit_cmd_schedule_id = t;
            u = {
                cmd: "load_cmd_schedule",
                cmd_id: cmdData.edit_cmd_schedule_id
            };
            $.ajax({
                type: "POST",
                url: "func/fn_cmd.php",
                data: u,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    document.getElementById("dialog_cmd_schedule_active").checked = strToBoolean(e.active), document.getElementById("dialog_cmd_schedule_name").value = e.name;
                    var t = strToBoolean(e.exact_time);
                    document.getElementById("dialog_cmd_schedule_exact_time").checked = t, cmdScheduleSwitchExactTime(), 1 == t ? (document.getElementById("dialog_cmd_schedule_exact_time_date").value = e.exact_time_dt.substring(0, 10), document.getElementById("dialog_cmd_schedule_exact_time_time").value = e.exact_time_dt.substring(11, 16)) : (document.getElementById("dialog_cmd_schedule_exact_time_date").value = "", document.getElementById("dialog_cmd_schedule_exact_time_time").value = "00:00"), $("#dialog_cmd_schedule_exact_time_time").multipleSelect("refresh");
                    var a = e.day_time;
                    null != a ? (document.getElementById("dialog_cmd_schedule_daily_mon").checked = a.mon, document.getElementById("dialog_cmd_schedule_daily_mon_time").value = a.mon_time, $("#dialog_cmd_schedule_daily_mon_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_tue").checked = a.tue, document.getElementById("dialog_cmd_schedule_daily_tue_time").value = a.tue_time, $("#dialog_cmd_schedule_daily_tue_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_wed").checked = a.wed, document.getElementById("dialog_cmd_schedule_daily_wed_time").value = a.wed_time, $("#dialog_cmd_schedule_daily_wed_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_thu").checked = a.thu, document.getElementById("dialog_cmd_schedule_daily_thu_time").value = a.thu_time, $("#dialog_cmd_schedule_daily_thu_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_fri").checked = a.fri, document.getElementById("dialog_cmd_schedule_daily_fri_time").value = a.fri_time, $("#dialog_cmd_schedule_daily_fri_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sat").checked = a.sat, document.getElementById("dialog_cmd_schedule_daily_sat_time").value = a.sat_time, $("#dialog_cmd_schedule_daily_sat_time").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_daily_sun").checked = a.sun, document.getElementById("dialog_cmd_schedule_daily_sun_time").value = a.sun_time, $("#dialog_cmd_schedule_daily_sun_time").multipleSelect("refresh")) : cmdScheduleResetDailyTime(), cmdScheduleProtocolList(), document.getElementById("dialog_cmd_schedule_protocol").value = e.protocol, $("#dialog_cmd_schedule_protocol").multipleSelect("refresh"), cmdScheduleSwitchProtocol();
                    var o = document.getElementById("dialog_cmd_schedule_object_list"),
                        i = e.imei.split(",");
                    multiselectSetValues(o, i), $("#dialog_cmd_schedule_object_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_template_list").value = "", $("#dialog_cmd_schedule_template_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_gateway").value = e.gateway, $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_type").value = e.type, $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_cmd").value = e.cmd
                }
            }), $("#dialog_cmd_schedule_properties").dialog("open");
            break;
        case "add":
            cmdData.edit_cmd_schedule_id = !1, document.getElementById("dialog_cmd_schedule_active").checked = !0, document.getElementById("dialog_cmd_schedule_name").value = "", document.getElementById("dialog_cmd_schedule_exact_time").checked = !1, cmdScheduleSwitchExactTime(), document.getElementById("dialog_cmd_schedule_exact_time_date").value = "", document.getElementById("dialog_cmd_schedule_exact_time_time").value = "00:00", $("#dialog_cmd_schedule_exact_time_time").multipleSelect("refresh"), cmdScheduleResetDailyTime(), cmdScheduleProtocolList(), document.getElementById("dialog_cmd_schedule_protocol").value = "", $("#dialog_cmd_schedule_protocol").multipleSelect("refresh"), cmdScheduleSwitchProtocol(), document.getElementById("dialog_cmd_schedule_template_list").value = "", $("#dialog_cmd_schedule_template_list").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_gateway").value = "gprs", $("#dialog_cmd_schedule_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_type").value = "ascii", $("#dialog_cmd_schedule_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_schedule_cmd_cmd").value = "", $("#dialog_cmd_schedule_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_cmd_schedule_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var a = document.getElementById("dialog_cmd_schedule_name").value;
            if ("" == a) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY, !0);
            var o = document.getElementById("dialog_cmd_schedule_active").checked,
                i = document.getElementById("dialog_cmd_schedule_exact_time").checked,
                s = document.getElementById("dialog_cmd_schedule_exact_time_date").value,
                n = document.getElementById("dialog_cmd_schedule_exact_time_time").value;
            if (1 == i) {
                if ("" == s) return void notifyBox("error", la.ERROR, la.DATE_CANT_BE_EMPTY, !0);
                l = s + " " + n + ":00"
            } else var l = "";
            var r = {
                mon: document.getElementById("dialog_cmd_schedule_daily_mon").checked,
                mon_time: document.getElementById("dialog_cmd_schedule_daily_mon_time").value,
                tue: document.getElementById("dialog_cmd_schedule_daily_tue").checked,
                tue_time: document.getElementById("dialog_cmd_schedule_daily_tue_time").value,
                wed: document.getElementById("dialog_cmd_schedule_daily_wed").checked,
                wed_time: document.getElementById("dialog_cmd_schedule_daily_wed_time").value,
                thu: document.getElementById("dialog_cmd_schedule_daily_thu").checked,
                thu_time: document.getElementById("dialog_cmd_schedule_daily_thu_time").value,
                fri: document.getElementById("dialog_cmd_schedule_daily_fri").checked,
                fri_time: document.getElementById("dialog_cmd_schedule_daily_fri_time").value,
                sat: document.getElementById("dialog_cmd_schedule_daily_sat").checked,
                sat_time: document.getElementById("dialog_cmd_schedule_daily_sat_time").value,
                sun: document.getElementById("dialog_cmd_schedule_daily_sun").checked,
                sun_time: document.getElementById("dialog_cmd_schedule_daily_sun_time").value
            };
            r = JSON.stringify(r);
            var d = document.getElementById("dialog_cmd_schedule_protocol").value,
                _ = document.getElementById("dialog_cmd_schedule_object_list");
            if (!multiselectIsSelected(_)) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
            _ = multiselectGetValues(_);
            var c = document.getElementById("dialog_cmd_schedule_cmd_gateway").value,
                g = document.getElementById("dialog_cmd_schedule_cmd_type").value,
                m = document.getElementById("dialog_cmd_schedule_cmd_cmd").value;
            if ("" == m) return void notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0);
            if ("hex" == g && (m = m.toUpperCase(), !isHexValid(m.replace("%IMEI%", "")))) return void notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0);
            var u = {
                cmd: "save_cmd_schedule",
                cmd_id: cmdData.edit_cmd_schedule_id,
                name: a,
                active: o,
                exact_time: i,
                exact_time_dt: l,
                day_time: r,
                protocol: d,
                imei: _,
                gateway: c,
                type: g,
                cmd_: m
            };
            $.ajax({
                type: "POST",
                url: "func/fn_cmd.php",
                data: u,
                cache: !1,
                success: function(e) {
                    "OK" == e && ($("#cmd_schedule_list_grid").trigger("reloadGrid"), $("#dialog_cmd_schedule_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function cmdScheduleDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_cmd_schedule",
                cmd_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_cmd.php",
                data: a,
                success: function(e) {
                    "OK" == e && $("#cmd_schedule_list_grid").trigger("reloadGrid")
                }
            })
        }
    })
}

function cmdScheduleDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#cmd_schedule_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_cmd_schedules",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_cmd.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && $("#cmd_schedule_list_grid").trigger("reloadGrid")
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function cmdTemplateReload() {
    cmdTemplateLoadData(), $("#cmd_template_list_grid").trigger("reloadGrid")
}

function cmdTemplateLoadData() {
    var e = {
        cmd: "load_cmd_template_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_cmd.php",
        data: e,
        dataType: "json",
        cache: !1,
        success: function(e) {
            cmdData.cmd_templates = e, cmdTemplateList(), cmdScheduleTemplateList()
        }
    })
}

function cmdTemplateImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", cmdTemplateImportCTEFile, !1), document.getElementById("load_file").click())
}

function cmdTemplateExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=cte";
        window.location = e
    }
}

function cmdTemplateImportCTEFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.cte) {
                var a = t.templates.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.TEMPLATES_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "cte",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && cmdTemplateReload()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", cmdTemplateImportCTEFile, !1)
}

function cmdTemplateProtocolList() {
    var e = document.getElementById("dialog_cmd_template_protocol").value,
        t = document.getElementById("dialog_cmd_template_hide_unsed_protocols").checked,
        a = document.getElementById("dialog_cmd_template_protocol");
    if (a.options.length = 0, 1 == t)
        for (var o = getAllProtocolsArray(), i = 0; i < o.length; i++) "" != o[i] && a.options.add(new Option(o[i], o[i]));
    else
        for (var s in gsValues.protocol_list) {
            var n = gsValues.protocol_list[s];
            a.options.add(new Option(n.name, n.name))
        }
    sortSelectList(a), a.options.add(new Option(la.ALL_PROTOCOLS, ""), 0), document.getElementById("dialog_cmd_template_protocol").value = e, $("#dialog_cmd_template_protocol").multipleSelect("refresh")
}

function cmdTemplateProperties(e) {
    switch (e) {
        default:
            var t = e;
            cmdData.edit_cmd_template_id = t, document.getElementById("dialog_cmd_template_hide_unsed_protocols").checked = !1, cmdTemplateProtocolList(), document.getElementById("dialog_cmd_template_name").value = cmdData.cmd_templates[t].name, document.getElementById("dialog_cmd_template_protocol").value = cmdData.cmd_templates[t].protocol, $("#dialog_cmd_template_protocol").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_gateway").value = cmdData.cmd_templates[t].gateway, $("#dialog_cmd_template_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_type").value = cmdData.cmd_templates[t].type, $("#dialog_cmd_template_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_cmd").value = cmdData.cmd_templates[t].cmd, $("#dialog_cmd_template_properties").dialog("open");
            break;
        case "add":
            cmdData.edit_cmd_template_id = !1, document.getElementById("dialog_cmd_template_hide_unsed_protocols").checked = !1, cmdTemplateProtocolList(), document.getElementById("dialog_cmd_template_name").value = "", document.getElementById("dialog_cmd_template_protocol").value = "", $("#dialog_cmd_template_protocol").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_gateway").value = "gprs", $("#dialog_cmd_template_gateway").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_type").value = "ascii", $("#dialog_cmd_template_type").multipleSelect("refresh"), document.getElementById("dialog_cmd_template_cmd").value = "", $("#dialog_cmd_template_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_cmd_template_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var a = document.getElementById("dialog_cmd_template_name").value,
                o = document.getElementById("dialog_cmd_template_protocol").value,
                i = document.getElementById("dialog_cmd_template_gateway").value,
                s = document.getElementById("dialog_cmd_template_type").value,
                n = document.getElementById("dialog_cmd_template_cmd").value;
            if ("" == a) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY, !0);
            if ("" == n) return void notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0);
            if ("hex" == s && (n = n.toUpperCase(), !isHexValid(n.replace("%IMEI%", "")))) return void notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0);
            var l = {
                cmd: "save_cmd_template",
                cmd_id: cmdData.edit_cmd_template_id,
                name: a,
                protocol: o,
                gateway: i,
                type: s,
                cmd_: n
            };
            $.ajax({
                type: "POST",
                url: "func/fn_cmd.php",
                data: l,
                cache: !1,
                success: function(e) {
                    "OK" == e && (cmdTemplateReload(), $("#dialog_cmd_template_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function cmdTemplateDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_cmd_template",
                cmd_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_cmd.php",
                data: a,
                success: function(e) {
                    "OK" == e && cmdTemplateReload()
                }
            })
        }
    })
}

function cmdTemplateDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#cmd_template_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_cmd_templates",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_cmd.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && cmdTemplateReload()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function eventsReloadData() {
    eventsCheckForNew()
}

function eventsLoadData() {
    clearTimeout(timer_eventsLoadData), timer_eventsLoadData = setTimeout("eventsLoadData();", 1e3 * gsValues.event_refresh), eventsCheckForNew()
}

function eventsCheckForNew() {
    var e = {
        cmd: "load_last_event"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_events.php",
        data: e,
        dataType: "json",
        success: function(e) {
            if (0 != e) {
                if (eventsData.last_id < e.event_id && 1 == eventsData.events_loaded && void 0 != settingsObjectData[e.imei] && "true" == settingsObjectData[e.imei].active) {
                    var t = !1,
                        a = !1;
                    "true" == e.notify_arrow && (t = e.notify_arrow_color), "true" == e.notify_ohc && (a = e.notify_ohc_color), objectSetStatusEvent(e.imei, t, a);
                    var o = e.notify_system.split(",");
                    if ("true" == o[0]) {
                        var i = e.lat,
                            s = e.lng,
                            n = urlPosition(i, s),
                            l = '<div class="row">';
                        l += '<div class="row2"><div class="width40"><strong>' + la.OBJECT + ':</strong></div><div class="width60">' + e.name + "</div></div>", l += '<div class="row2"><div class="width40"><strong>' + la.EVENT + ':</strong></div><div class="width60">' + e.event_desc + "</div></div>", l += '<div class="row2"><div class="width40"><strong>' + la.POSITION + ':</strong></div><div class="width60">' + n + "</div></div>", l += '<div class="row2"><div class="width40"><strong>' + la.TIME + ':</strong></div><div class="width60">' + e.dt_tracker + "</div></div>", l += "</div>", l += '<div class="row">', l += '<center><a href="#" onclick="eventsShowEvent(' + e.event_id + ');">Show event</a></center>', l += "</div>";
                        var r = !1;
                        "true" == o[1] && (r = !0), notifyBox("error", la.NEW_EVENT, l, r), "true" == o[2] && (void 0 == o[3] && (o[3] = "alarm1.mp3"), new Audio("snd/" + o[3]).play())
                    }
                }
                eventsData.last_id = e.event_id
            }
            $("#side_panel_events_event_list_grid").trigger("reloadGrid"), eventsData.events_loaded = !0
        }
    })
}

function eventsDeleteAll() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_EVENTS, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_events"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_events.php",
                data: t,
                success: function(e) {
                    "OK" == e && $("#side_panel_events_event_list_grid").trigger("reloadGrid")
                }
            })
        }
    })
}

function eventsShowEvent(e) {
    var t = {
        cmd: "load_event_data",
        event_id: e
    };
    $.ajax({
        type: "POST",
        url: "func/fn_events.php",
        data: t,
        dataType: "json",
        cache: !1,
        success: function(e) {
            showExtraData("event", e.imei, e);
            var t = e.lat,
                a = e.lng,
                o = e.angle;
            geocoderGetAddress(t, a, function(i) {
                var s = e.imei,
                    n = i,
                    l = urlPosition(t, a),
                    r = e.params,
                    d = "",
                    _ = new Array;
                for (var c in settingsObjectData[s].sensors) _.push(settingsObjectData[s].sensors[c]);
                var g = sortArrayByElement(_, "name");
                for (var c in g) {
                    var m = g[c];
                    if ("true" == m.popup) {
                        var u = getSensorValue(r, m);
                        d += "<tr><td><strong>" + m.name + ":</strong></td><td>" + u.value_full + "</td></tr>"
                    }
                }
                var p = "<table>\t\t\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + e.name + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.EVENT + ":</strong></td><td>" + e.event_desc + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + n + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + l + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + e.altitude + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + e.angle + " &deg;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + e.speed + " " + la.UNIT_SPEED + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + e.dt_tracker + "</td></tr>",
                    y = getObjectOdometer(s, r); - 1 != y && (p += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + y + " " + la.UNIT_DISTANCE + "</td></tr>");
                var v = getObjectEngineHours(s, r); - 1 != v && (p += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + v + "</td></tr>");
                var b = p + d;
                addPopupToMap(t, a, [0, 0], p += "</table>", b += "</table>"), map.panTo({
                    lat: t,
                    lng: a
                }), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(t, a, o))
            })
        }
    })
}

function initMap() {
    map = L.map("map", {
        minZoom: gsValues.map_min_zoom,
        maxZoom: gsValues.map_max_zoom,
        editable: !0,
        zoomControl: !1
    }), initSelectList("map_layer_list"), defineMapLayers(), mapLayers.utils = L.layerGroup(), mapLayers.utils.addTo(map), mapLayers.realtime = createCluster("objects"), mapLayers.realtime.addTo(map), mapLayers.history = L.layerGroup(), mapLayers.history.addTo(map), mapLayers.places_markers = createCluster("markers"), mapLayers.places_markers.addTo(map), mapLayers.places_zones = L.layerGroup(), mapLayers.places_zones.addTo(map), mapLayers.places_routes = L.layerGroup(), mapLayers.places_routes.addTo(map), map.addControl(L.control.zoom({
        zoomInText: "",
        zoomOutText: "",
        zoomInTitle: la.ZOOM_IN,
        zoomOutTitle: la.ZOOM_OUT
    })), L.MapViewControls = mapViewControls(), map.addControl(new L.MapViewControls), L.MapViewControls = mapToolControls(), map.addControl(new L.MapViewControls), map.setView([gsValues.map_lat, gsValues.map_lng], gsValues.map_zoom), switchMapLayer(gsValues.map_layer), gsValues.map_objects || document.getElementById("map_control_objects").click(), gsValues.map_object_labels || (iconObjectLabels.className = "icon-text enable"), gsValues.map_markers || document.getElementById("map_control_markers").click(), gsValues.map_routes || document.getElementById("map_control_routes").click(), gsValues.map_zones || document.getElementById("map_control_zones").click(), map.on("zoomend", function() {
        historyRouteDataPoints()
    });
    var e = settingsUserData.map_is,
        t = 28 * e,
        a = 28 * e,
        o = 14 * e,
        i = 14 * e,
        t = 28 * e,
        a = 28 * e,
        o = 14 * e,
        i = 14 * e;
    mapMarkerIcons.arrow_black = L.icon({
        iconUrl: "img/markers/arrow-black.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_blue = L.icon({
        iconUrl: "img/markers/arrow-blue.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_green = L.icon({
        iconUrl: "img/markers/arrow-green.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_grey = L.icon({
        iconUrl: "img/markers/arrow-grey.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_orange = L.icon({
        iconUrl: "img/markers/arrow-orange.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_purple = L.icon({
        iconUrl: "img/markers/arrow-purple.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_red = L.icon({
        iconUrl: "img/markers/arrow-red.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.arrow_yellow = L.icon({
        iconUrl: "img/markers/arrow-yellow.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), t = 28 * e, a = 28 * e, o = 14 * e, i = 28 * e, mapMarkerIcons.route_start = L.icon({
        iconUrl: "img/markers/route-start.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.route_end = L.icon({
        iconUrl: "img/markers/route-end.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.route_stop = L.icon({
        iconUrl: "img/markers/route-stop.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.route_event = L.icon({
        iconUrl: "img/markers/route-event.svg",
        iconSize: [t, a],
        iconAnchor: [o, i],
        popupAnchor: [0, 0]
    }), mapMarkerIcons.route_data_point = L.icon({
        iconUrl: "img/markers/route-data-point.svg",
        iconSize: [8, 8],
        iconAnchor: [4, 4],
        popupAnchor: [0, 0]
    })
}

function initGui() {
    $("#map_action_menu").menu({
        role: "listbox",
        select: function(e, t) {
            var a = menuOnItem,
                o = t.item.children().attr("tag");
            "street_view_new" == o && utilsStreetViewPoint(a.lat, a.lng, !0), "show_point" == o && utilsPointOnMap(a.lat, a.lng), "route_to_point" == o && utilsRouteToPoint(a), "add_marker" == o && (document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_markers_tab").click(), placesMarkerNew(a)), "add_route" == o && (document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_routes_tab").click(), placesRouteNew(a)), "add_zone" == o && (document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_zones_tab").click(), placesZoneNew(a))
        }
    }), $("#map_action_menu").hide(), $("#side_panel_objects_action_menu").menu({
        role: "listbox",
        select: function(e, t) {
            var a = menuOnItem,
                o = t.item.children().attr("tag");
            "edit" == o && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit") && loadSettings("objects", function() {
                settingsObjectEdit(a)
            }), "cmd" == o && (document.getElementById("cmd_object_list").value = a, cmdOpen()), "follow" == o && utilsFollowObject(a, !1), "follow_new" == o && utilsFollowObject(a, !0), "street_view" == o && utilsStreetViewObject(a, !1), "street_view_new" == o && utilsStreetViewObject(a, !0), "sh" == o.substring(0, 2) && (document.getElementById("side_panel_history_object_list").value = a, $("#side_panel_history_object_list").multipleSelect("refresh"), "shlh" == o && (document.getElementById("side_panel_history_filter").value = 1), "sht" == o && (document.getElementById("side_panel_history_filter").value = 2), "shy" == o && (document.getElementById("side_panel_history_filter").value = 3), "shb2" == o && (document.getElementById("side_panel_history_filter").value = 4), "shb3" == o && (document.getElementById("side_panel_history_filter").value = 5), "shtw" == o && (document.getElementById("side_panel_history_filter").value = 6), "shlw" == o && (document.getElementById("side_panel_history_filter").value = 7), "shtm" == o && (document.getElementById("side_panel_history_filter").value = 8), "shlm" == o && (document.getElementById("side_panel_history_filter").value = 9), $("#side_panel_history_filter").multipleSelect("refresh"), switchHistoryReportsDateFilter("history"), historyLoadRoute())
        }
    }), $("#side_panel_objects_action_menu").hide(), $("#side_panel_history_import_export_action_menu").menu({
        role: "listbox"
    }), $("#side_panel_history_import_export_action_menu").hide(), $("#side_panel_history_import_export_action_menu_button").click(function() {
        return $("#side_panel_history_import_export_action_menu").toggle().position({
            my: "left top",
            at: "left bottom+2",
            of: this
        }), $(document).one("click", function() {
            $("#side_panel_history_import_export_action_menu").hide()
        }), !1
    }), $("#report_action_menu").menu({
        role: "listbox",
        select: function(e, t) {
            var a = menuOnItem,
                o = t.item.children().attr("tag");
            if ("grlh" == o) {
                var i = moment().format("YYYY-MM-DD"),
                    s = moment().format("YYYY-MM-DD");
                i += " " + moment().subtract("hour", 1).format("HH") + ":" + moment().subtract("hour", 1).format("mm") + ":00", s += " " + moment().format("HH") + ":" + moment().format("mm") + ":00"
            }
            if ("grt" == o) var i = moment().format("YYYY-MM-DD") + " 00:00:00",
                s = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
            if ("gry" == o) var i = moment().subtract("days", 1).format("YYYY-MM-DD") + " 00:00:00",
                s = moment().format("YYYY-MM-DD") + " 00:00:00";
            if ("grb2" == o) var i = moment().subtract("days", 2).format("YYYY-MM-DD") + " 00:00:00",
                s = moment().subtract("days", 1).format("YYYY-MM-DD") + " 00:00:00";
            if ("grb3" == o) var i = moment().subtract("days", 3).format("YYYY-MM-DD") + " 00:00:00",
                s = moment().subtract("days", 2).format("YYYY-MM-DD") + " 00:00:00";
            if ("grtw" == o) var i = moment().isoWeekday(1).format("YYYY-MM-DD") + " 00:00:00",
                s = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
            if ("grlw" == o) var i = moment().isoWeekday(1).subtract("week", 1).format("YYYY-MM-DD") + " 00:00:00",
                s = moment().isoWeekday(1).format("YYYY-MM-DD") + " 00:00:00";
            if ("grtm" == o) var i = moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00",
                s = moment().add("days", 1).format("YYYY-MM-DD") + " 00:00:00";
            if ("grlm" == o) var i = moment().startOf("month").subtract("month", 1).format("YYYY-MM-DD") + " 00:00:00",
                s = moment().startOf("month").format("YYYY-MM-DD") + " 00:00:00";
            "gr" == o.substring(0, 2) && reportGenerate({
                cmd: "report",
                name: reportsData.reports[a].name,
                type: reportsData.reports[a].type,
                format: reportsData.reports[a].format,
                show_coordinates: reportsData.reports[a].show_coordinates,
                show_addresses: reportsData.reports[a].show_addresses,
                zones_addresses: reportsData.reports[a].zones_addresses,
                stop_duration: reportsData.reports[a].stop_duration,
                speed_limit: reportsData.reports[a].speed_limit,
                imei: reportsData.reports[a].imei,
                zone_ids: reportsData.reports[a].zone_ids,
                sensor_names: reportsData.reports[a].sensor_names,
                data_items: reportsData.reports[a].data_items,
                dtf: i,
                dtt: s
            })
        }
    }), $("#report_action_menu").hide(), $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker, $.datepicker._updateDatepicker = function(e) {
        $.datepicker._updateDatepicker_original(e);
        var t = this._get(e, "afterShow");
        t && t.apply(e.input ? e.input[0] : null)
    }, $(".inputbox-calendar").datepicker({
        afterShow: function() {
            $(".ui-datepicker select").multipleSelect({
                single: !0
            })
        },
        changeMonth: !0,
        changeYear: !0,
        dateFormat: "yy-mm-dd",
        firstDay: 1,
        dayNamesMin: [la.DAY_SUNDAY_S, la.DAY_MONDAY_S, la.DAY_TUESDAY_S, la.DAY_WEDNESDAY_S, la.DAY_THURSDAY_S, la.DAY_FRIDAY_S, la.DAY_SATURDAY_S],
        monthNames: [la.MONTH_JANUARY, la.MONTH_FEBRUARY, la.MONTH_MARCH, la.MONTH_APRIL, la.MONTH_MAY, la.MONTH_JUNE, la.MONTH_JULY, la.MONTH_AUGUST, la.MONTH_SEPTEMBER, la.MONTH_OCTOBER, la.MONTH_NOVEMBER, la.MONTH_DECEMBER],
        monthNamesShort: [la.MONTH_JANUARY_S, la.MONTH_FEBRUARY_S, la.MONTH_MARCH_S, la.MONTH_APRIL_S, la.MONTH_MAY_S, la.MONTH_JUNE_S, la.MONTH_JULY_S, la.MONTH_AUGUST_S, la.MONTH_SEPTEMBER_S, la.MONTH_OCTOBER_S, la.MONTH_NOVEMBER_S, la.MONTH_DECEMBER_S]
    }), $(".inputbox-calendar-mmdd").datepicker({
        afterShow: function() {
            $(".ui-datepicker select").multipleSelect({
                single: !0
            })
        },
        changeMonth: !0,
        changeYear: !0,
        dateFormat: "mm-dd",
        firstDay: 1,
        dayNamesMin: [la.DAY_SUNDAY_S, la.DAY_MONDAY_S, la.DAY_TUESDAY_S, la.DAY_WEDNESDAY_S, la.DAY_THURSDAY_S, la.DAY_FRIDAY_S, la.DAY_SATURDAY_S],
        monthNames: [la.MONTH_JANUARY, la.MONTH_FEBRUARY, la.MONTH_MARCH, la.MONTH_APRIL, la.MONTH_MAY, la.MONTH_JUNE, la.MONTH_JULY, la.MONTH_AUGUST, la.MONTH_SEPTEMBER, la.MONTH_OCTOBER, la.MONTH_NOVEMBER, la.MONTH_DECEMBER],
        monthNamesShort: [la.MONTH_JANUARY_S, la.MONTH_FEBRUARY_S, la.MONTH_MARCH_S, la.MONTH_APRIL_S, la.MONTH_MAY_S, la.MONTH_JUNE_S, la.MONTH_JULY_S, la.MONTH_AUGUST_S, la.MONTH_SEPTEMBER_S, la.MONTH_OCTOBER_S, la.MONTH_NOVEMBER_S, la.MONTH_DECEMBER_S]
    }), $("#side_panel,\t  #side_panel_places,\t  #bottom_panel_tabs,\t  #cmd_tabs,\t  #settings_main,\t  #settings_main_objects_groups_drivers,\t  #settings_object,\t  #settings_object_edit_select_icon_tabs,\t  #settings_event,\t  #reports_tabs,\t  #places_marker_icon_tabs").tabs({
        show: function() {
            var e = $(ui.panel);
            $(".content:visible").effect(function() {
                e.fadeIn()
            })
        }
    }), $("#dialog_notify").dialog({
        autoOpen: !1,
        width: "auto",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        draggable: !1,
        dialogClass: "dialog-notify-titlebar"
    }), $("#dialog_confirm").dialog({
        autoOpen: !1,
        width: "auto",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        draggable: !1,
        dialogClass: "dialog-notify-titlebar"
    }), $("#dialog_about").dialog({
        autoOpen: !1,
        width: "480",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_show_point").dialog({
        autoOpen: !1,
        width: "250",
        height: "auto",
        minHeight: "auto",
        position: {
            my: "left top",
            at: "left+412 top+47"
        },
        resizable: !1
    }), $("#dialog_address_search").dialog({
        autoOpen: !1,
        width: "250",
        height: "auto",
        minHeight: "auto",
        position: {
            my: "left top",
            at: "left+412 top+47"
        },
        resizable: !1
    }), $("#dialog_cmd").dialog({
        autoOpen: !1,
        width: "880",
        height: "auto",
        minHeight: "auto",
        resizable: !1
    }), $("#dialog_cmd_schedule_properties").dialog({
        autoOpen: !1,
        width: "750",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_cmd_template_properties").dialog({
        autoOpen: !1,
        width: "450",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_image_gallery").dialog({
        autoOpen: !1,
        width: "992",
        height: "auto",
        minHeight: "auto",
        resizable: !1
    }), $("#dialog_chat").dialog({
        autoOpen: !1,
        width: "992",
        height: "500",
        minWidth: 500,
        minHeight: 300,
        resizable: !0,
        close: function(e, t) {
            chatClose()
        }
    }), $("#dialog_reports").dialog({
        autoOpen: !1,
        width: "992",
        height: "auto",
        minHeight: "auto",
        resizable: !1
    }), $("#dialog_report_properties").dialog({
        autoOpen: !1,
        width: "850",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_rilogbook").dialog({
        autoOpen: !1,
        width: "992",
        height: "500",
        minWidth: 992,
        minHeight: 350,
        resizable: !0,
        close: function(e, t) {
            rilogbookClose()
        }
    }), $("#dialog_dtc").dialog({
        autoOpen: !1,
        width: "992",
        height: "500",
        minWidth: 992,
        minHeight: 350,
        resizable: !0,
        close: function(e, t) {
            dtcClose()
        }
    }), $("#dialog_settings").dialog({
        autoOpen: !1,
        width: "750",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        close: function(e, t) {
            settingsClose()
        }
    }), $("#dialog_settings_object_add").dialog({
        autoOpen: !1,
        width: "300",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_edit").dialog({
        autoOpen: !1,
        width: "720",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_duplicate").dialog({
        autoOpen: !1,
        width: "300",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_edit_select_icon").dialog({
        autoOpen: !1,
        width: "412",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_group_properties").dialog({
        autoOpen: !1,
        width: "350",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_driver_properties").dialog({
        autoOpen: !1,
        width: "500",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_passenger_properties").dialog({
        autoOpen: !1,
        width: "400",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_trailer_properties").dialog({
        autoOpen: !1,
        width: "400",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_sensor_properties").dialog({
        autoOpen: !1,
        width: "600",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_service_properties").dialog({
        autoOpen: !1,
        width: "720",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_object_custom_field_properties").dialog({
        autoOpen: !1,
        width: "350",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_event_properties").dialog({
        autoOpen: !1,
        width: "720",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        open: function(e, t) {
            $("#settings_event").tabs("option", "active", 0)
        }
    }), $("#dialog_settings_template_properties").dialog({
        autoOpen: !1,
        width: "800",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_settings_subaccount_properties").dialog({
        autoOpen: !1,
        width: "750",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_places_groups").dialog({
        autoOpen: !1,
        width: "750",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        close: function(e, t) {
            placesGroupClose()
        }
    }), $("#dialog_places_group_properties").dialog({
        autoOpen: !1,
        width: "350",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1
    }), $("#dialog_places_marker_properties").dialog({
        autoOpen: !1,
        width: "324",
        height: "auto",
        minHeight: "auto",
        resizable: !1,
        draggable: !1,
        position: {
            my: "left top",
            at: "left+10 top+112"
        },
        closeOnEscape: !1,
        open: function(e, t) {
            $(this).parent().children().children(".ui-dialog-titlebar-close").remove()
        }
    }), $("#dialog_places_zone_properties").dialog({
        autoOpen: !1,
        width: "265",
        height: "auto",
        minHeight: "auto",
        resizable: !1,
        draggable: !1,
        position: {
            my: "left top",
            at: "left+10 top+112"
        },
        closeOnEscape: !1,
        open: function(e, t) {
            $(this).parent().children().children(".ui-dialog-titlebar-close").remove()
        }
    }), $("#dialog_places_route_properties").dialog({
        autoOpen: !1,
        width: "265",
        height: "auto",
        minHeight: "auto",
        resizable: !1,
        draggable: !1,
        position: {
            my: "left top",
            at: "left+10 top+112"
        },
        closeOnEscape: !1,
        open: function(e, t) {
            $(this).parent().children().children(".ui-dialog-titlebar-close").remove()
        }
    }), $("#dialog_billing").dialog({
        autoOpen: !1,
        width: "750",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        dialogClass: "dialog-billing-titlebar",
        close: function(e, t) {
            billingClose()
        }
    }), $("#dialog_billing_plan_use").dialog({
        autoOpen: !1,
        width: "695",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        dialogClass: "dialog-billing-titlebar"
    }), $("#dialog_billing_plan_purchase").dialog({
        autoOpen: !1,
        width: "695",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        dialogClass: "dialog-billing-titlebar"
    }), $("#side_panel_objects_dragbar").mousedown(function(e) {
        e.preventDefault(), $(document).mousemove(guiDragbarObjectsHandler)
    }), $("#side_panel_events_dragbar").mousedown(function(e) {
        e.preventDefault(), $(document).mousemove(guiDragbarEventsHandler)
    }), $("#side_panel_history_dragbar").mousedown(function(e) {
        e.preventDefault(), $(document).mousemove(guiDragbarHistoryHandler)
    }), $("#bottom_panel_dragbar").mousedown(function(e) {
        e.preventDefault(), $(document).mousemove(guiDragbarBottomPanelHandler)
    }), $(document).mouseup(function(e) {
        map.invalidateSize(!0), $("#map").css("pointer-events", ""), $(document).unbind("mousemove", guiDragbarObjectsHandler), $(document).unbind("mousemove", guiDragbarEventsHandler), $(document).unbind("mousemove", guiDragbarHistoryHandler), $(document).unbind("mousemove", guiDragbarBottomPanelHandler)
    }), map.on("contextmenu", function(e) {
        menuOnItem = e.latlng, $("#map_action_menu").toggle().position({
            my: "left top",
            at: "left+" + e.containerPoint.x + " top+" + e.containerPoint.y,
            collision: "fit",
            of: $("#map")
        }), $(document).one("click", function() {
            $("#map_action_menu").hide()
        })
    }), $(".select").multipleSelect({
        single: !0
    }), $(".select-search").multipleSelect({
        width: "100%",
        single: !0,
        filter: !0
    }), $(".select-multiple").multipleSelect({
        width: "100%",
        selectAllText: la.SELECT_ALL,
        allSelected: la.ALL_SELECTED,
        countSelected: "# " + la.SELECTED.toLowerCase(),
        noMatchesFound: la.NO_MATCHES_FOUND,
        noItems: la.NO_ITEMS,
        placeholder: la.NOTHING_SELECTED
    }), $(".select-multiple-search").multipleSelect({
        width: "100%",
        filter: !0,
        selectAllText: la.SELECT_ALL,
        allSelected: la.ALL_SELECTED,
        countSelected: "# " + la.SELECTED.toLowerCase(),
        noMatchesFound: la.NO_MATCHES_FOUND,
        noItems: la.NO_ITEMS,
        placeholder: la.NOTHING_SELECTED
    }), initSelectList("object_device_list"), document.getElementById("side_panel_history_filter").value = 2, $("#side_panel_history_filter").multipleSelect("refresh"), document.getElementById("dialog_report_filter").value = 2, $("#dialog_report_filter").multipleSelect("refresh"), switchHistoryReportsDateFilter("history"), switchHistoryReportsDateFilter("report"), switchHistoryReportsDateFilter("img"), switchHistoryReportsDateFilter("rilogbook"), switchHistoryReportsDateFilter("dtc")
}

function addPopupToMap(e, t, a, o, i) {
    if ("" != i && o != i) {
        if (1 == gsValues.map_popup_detailed) var s = 'style="display:none;"',
            n = "";
        else var s = "",
            n = 'style="display:none;"';
        o = '<div id="popup_short" ' + s + ">" + o, o += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="switchPopupDetailed(true)">' + la.DETAILED + "</a></div>", o += "</div>", o += '<div id="popup_detailed" ' + n + ">" + i, o += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="switchPopupDetailed(false)">' + la.SHORT + "</a></div>", o += "</div>"
    }
    mapPopup = L.popup({
        offset: a
    }).setLatLng([e, t]).setContent(o).openOn(map)
}

function switchPopupDetailed(e) {
    switch (e) {
        case !1:
            document.getElementById("popup_short").style.display = "", document.getElementById("popup_detailed").style.display = "none", gsValues.map_popup_detailed = !1;
            break;
        case !0:
            document.getElementById("popup_short").style.display = "none", document.getElementById("popup_detailed").style.display = "", gsValues.map_popup_detailed = !0
    }
}

function destroyMapPopup() {
    map.closePopup()
}

function loadingData(e) {
    document.getElementById("loading_data_panel").style.display = 1 == e ? "" : "none"
}

function notifyBox(e, t, a, o) {
    $.pnotify({
        title: t,
        text: a,
        type: e,
        opacity: .8,
        closer_hover: !1,
        sticker_hover: !1,
        hide: o
    })
}

function notifyDialog(e) {
    document.getElementById("dialog_notify_text").innerHTML = e, $("#dialog_notify").dialog("open")
}

function confirmDialog(e, t) {
    confirmResponseValue = !1, document.getElementById("dialog_confirm_text").innerHTML = e, $("#dialog_confirm").dialog("destroy"), $("#dialog_confirm").dialog({
        autoOpen: !1,
        width: "auto",
        height: "auto",
        minHeight: "auto",
        modal: !0,
        resizable: !1,
        draggable: !1,
        dialogClass: "dialog-notify-titlebar",
        close: function(e, a) {
            t(confirmResponseValue)
        }
    }), $("#dialog_confirm").dialog("open")
}

function confirmResponse(e) {
    confirmResponseValue = e, $("#dialog_confirm").dialog("close")
}

function loadObjectMapMarkerIcons() {
    var e = new Array;
    for (var t in settingsObjectData) {
        var a = settingsObjectData[t];
        e.push(a.icon)
    }
    for (e = uniqueArray(e), i = 0; i < e.length; i++) {
        var o = e[i],
            s = e[i],
            n = settingsUserData.map_is;
        mapMarkerIcons[o] = L.icon({
            iconUrl: s,
            iconSize: [28 * n, 28 * n],
            iconAnchor: [14 * n, 14 * n],
            popupAnchor: [0, 0]
        })
    }
}

function addPointerOverMarker(e) {
    var t = function(e) {
            document.getElementById("map").style.cursor = "pointer", OpenLayers.Event.stop(e)
        },
        a = function(e) {
            document.getElementById("map").style.cursor = "auto", OpenLayers.Event.stop(e)
        };
    e.events.register("mouseover", e, t), e.events.register("mouseout", e, a)
}

function rotateMarker(e, t, a) {
    $("#" + e.markers[t].icon.imageDiv.id).css("-moz-transform", "rotate(" + a + "deg)"), $("#" + e.markers[t].icon.imageDiv.id).css("-webkit-transform", "rotate(" + a + "deg)"), $("#" + e.markers[t].icon.imageDiv.id).css("-o-transform", "rotate(" + a + "deg)")
}

function createCluster(e) {
    var t = settingsUserData.map_is;
    if ("objects" == e) var a = "img/markers/clusters/objects.svg",
        o = "marker-cluster";
    else {
        if ("markers" != e) return !1;
        var a = "img/markers/clusters/markers.svg",
            o = "marker-cluster"
    }
    if (1 == gsValues.map_clusters) i = gsValues.map_max_zoom + 1;
    else var i = gsValues.map_min_zoom;
    return new L.MarkerClusterGroup({
        spiderfyDistanceMultiplier: 2 * t,
        spiderfyOnMaxZoom: !0,
        showCoverageOnHover: !1,
        maxClusterRadius: 60,
        disableClusteringAtZoom: i,
        iconCreateFunction: function(e) {
            var i = e.getChildCount(),
                s = " cluster-";
            return s += i < 10 ? "small" : i < 100 ? "medium" : "large", L.divIcon({
                html: '<div><img src="' + a + '"><span>' + i + "</span></div>",
                className: o + s,
                iconSize: L.point(40 * t, 40 * t),
                iconAnchor: [14 * t, 14 * t],
                popupAnchor: [40 * t, 0 * t]
            })
        }
    })
}

function mapViewControls() {
    return L.Control.extend({
        options: {
            position: "topleft"
        },
        onAdd: function(e) {
            var t = L.DomUtil.create("div", "leaflet-control leaflet-bar");
            linkObjects = L.DomUtil.create("a", "", t), linkObjects.id = "map_control_objects", linkObjects.href = "#", linkObjects.title = la.ENABLE_DISABLE_OBJECTS, linkObjects.className = "", iconObjects = L.DomUtil.create("span", "", linkObjects), iconObjects.className = "icon-objects";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkObjects, "dblclick", a), L.DomEvent.on(linkObjects, "mousedown", a), L.DomEvent.on(linkObjects, "click", function(t) {
                1 == e.hasLayer(mapLayers.realtime) ? (e.removeLayer(mapLayers.realtime), iconObjects.className = "icon-objects enable", gsValues.map_objects = !1) : (e.addLayer(mapLayers.realtime), iconObjects.className = "icon-objects", gsValues.map_objects = !0)
            }), linkObjectLabels = L.DomUtil.create("a", "", t), linkObjectLabels.id = "map_control_object_labels", linkObjectLabels.href = "#", linkObjectLabels.title = la.ENABLE_DISABLE_OBJECT_LABELS, linkObjectLabels.className = "", iconObjectLabels = L.DomUtil.create("span", "", linkObjectLabels), iconObjectLabels.className = "icon-text";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkObjectLabels, "dblclick", a), L.DomEvent.on(linkObjectLabels, "mousedown", a), L.DomEvent.on(linkObjectLabels, "click", function(e) {
                if (1 == gsValues.map_object_labels) {
                    for (var t in objectsData) objectsData[t].layers.marker.closeTooltip();
                    iconObjectLabels.className = "icon-text enable", gsValues.map_object_labels = !1
                } else {
                    for (var t in objectsData) objectsData[t].layers.marker.openTooltip();
                    iconObjectLabels.className = "icon-text", gsValues.map_object_labels = !0
                }
            }), linkMarkers = L.DomUtil.create("a", "", t), linkMarkers.id = "map_control_markers", linkMarkers.href = "#", linkMarkers.title = la.ENABLE_DISABLE_MARKERS, linkMarkers.className = "", iconMarkers = L.DomUtil.create("span", "", linkMarkers), iconMarkers.className = "icon-markers";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkMarkers, "dblclick", a), L.DomEvent.on(linkMarkers, "mousedown", a), L.DomEvent.on(linkMarkers, "click", function(t) {
                1 == e.hasLayer(mapLayers.places_markers) ? (e.removeLayer(mapLayers.places_markers), iconMarkers.className = "icon-markers enable", gsValues.map_markers = !1) : (e.addLayer(mapLayers.places_markers), iconMarkers.className = "icon-markers", gsValues.map_markers = !0)
            }), linkRoutes = L.DomUtil.create("a", "", t), linkRoutes.id = "map_control_routes", linkRoutes.href = "#", linkRoutes.title = la.ENABLE_DISABLE_ROUTES, linkRoutes.className = "", iconRoutes = L.DomUtil.create("span", "", linkRoutes), iconRoutes.className = "icon-routes";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkRoutes, "dblclick", a), L.DomEvent.on(linkRoutes, "mousedown", a), L.DomEvent.on(linkRoutes, "click", function(t) {
                1 == e.hasLayer(mapLayers.places_routes) ? (e.removeLayer(mapLayers.places_routes), iconRoutes.className = "icon-routes enable", gsValues.map_routes = !1) : (e.addLayer(mapLayers.places_routes), iconRoutes.className = "icon-routes", gsValues.map_routes = !0)
            }), linkZones = L.DomUtil.create("a", "", t), linkZones.id = "map_control_zones", linkZones.href = "#", linkZones.title = la.ENABLE_DISABLE_ZONES, linkZones.className = "", iconZones = L.DomUtil.create("span", "", linkZones), iconZones.className = "icon-zones";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkZones, "dblclick", a), L.DomEvent.on(linkZones, "mousedown", a), L.DomEvent.on(linkZones, "click", function(t) {
                1 == e.hasLayer(mapLayers.places_zones) ? (e.removeLayer(mapLayers.places_zones), iconZones.className = "icon-zones enable", gsValues.map_zones = !1) : (e.addLayer(mapLayers.places_zones), iconZones.className = "icon-zones", gsValues.map_zones = !0)
            }), linkClusters = L.DomUtil.create("a", "", t), linkClusters.id = "map_control_clusters", linkClusters.href = "#", linkClusters.title = la.ENABLE_DISABLE_CLUSTERS, linkClusters.className = "", iconClusters = L.DomUtil.create("span", "", linkClusters), 1 == gsValues.map_clusters ? iconClusters.className = "icon-clusters" : iconClusters.className = "icon-clusters enable";
            a = L.DomEvent.stopPropagation;
            if (L.DomEvent.on(linkClusters, "dblclick", a), L.DomEvent.on(linkClusters, "mousedown", a), L.DomEvent.on(linkClusters, "click", function(e) {
                    1 == gsValues.map_clusters ? (mapLayers.realtime.options.disableClusteringAtZoom = gsValues.map_min_zoom, mapLayers.places_markers.options.disableClusteringAtZoom = gsValues.map_min_zoom, iconClusters.className = "icon-clusters enable", gsValues.map_clusters = !1) : (mapLayers.realtime.options.disableClusteringAtZoom = gsValues.map_max_zoom + 1, mapLayers.places_markers.options.disableClusteringAtZoom = gsValues.map_max_zoom + 1, iconClusters.className = "icon-clusters", gsValues.map_clusters = !0), objectAddAllToMap(), placesMarkerAddAllToMap()
                }), gsValues.map_google && gsValues.map_google_street_view) {
                linkStreetView = L.DomUtil.create("a", "", t), linkStreetView.id = "map_control_street_view", linkStreetView.href = "#", linkStreetView.title = la.ENABLE_DISABLE_STREET_VIEW, linkStreetView.className = "", iconStreetView = L.DomUtil.create("span", "", linkStreetView), iconStreetView.className = "icon-street enable";
                a = L.DomEvent.stopPropagation;
                L.DomEvent.on(linkStreetView, "dblclick", a), L.DomEvent.on(linkStreetView, "mousedown", a), L.DomEvent.on(linkStreetView, "click", function(e) {
                    if (1 == gsValues.map_street_view) document.getElementById("street_view_control").style.display = "", iconStreetView.className = "icon-street enable", gsValues.map_street_view = !1;
                    else {
                        document.getElementById("street_view_control").style.display = "block", iconStreetView.className = "icon-street", gsValues.map_street_view = !0;
                        for (var t in objectsData) 1 == objectsData[t].selected && utilsStreetView(objectsData[t].data[0].lat, objectsData[t].data[0].lng, objectsData[t].data[0].angle)
                    }
                })
            }
            if (gsValues.map_google && gsValues.map_google_traffic) {
                linkTraffic = L.DomUtil.create("a", "", t), linkTraffic.id = "map_control_traffic", linkTraffic.href = "#", linkTraffic.title = la.ENABLE_DISABLE_LIVE_TRAFFIC, linkTraffic.className = "", iconTraffic = L.DomUtil.create("span", "", linkTraffic), iconTraffic.className = "icon-traffic enable";
                var a = L.DomEvent.stopPropagation;
                L.DomEvent.on(linkTraffic, "dblclick", a), L.DomEvent.on(linkTraffic, "mousedown", a), L.DomEvent.on(linkTraffic, "click", function(e) {
                    1 == gsValues.map_traffic ? (iconTraffic.className = "icon-traffic enable", gsValues.map_traffic = !1, strMatches("gmap,ghyb,gter", gsValues.map_layer.toString()) && switchMapLayer(gsValues.map_layer)) : strMatches("gmap,ghyb,gter", gsValues.map_layer.toString()) ? (iconTraffic.className = "icon-traffic", gsValues.map_traffic = !0, switchMapLayer(gsValues.map_layer)) : notifyBox("error", la.LIVE_TRAFFIC, la.LIVE_TRAFFIC_FOR_THIS_MAP_IS_NOT_AVAILABLE)
                })
            }
            return t
        }
    })
}

function mapToolControls() {
    return L.Control.extend({
        options: {
            position: "topleft"
        },
        onAdd: function(e) {
            var t = L.DomUtil.create("div", "leaflet-control leaflet-bar");
            linkFitObjects = L.DomUtil.create("a", "", t), linkFitObjects.id = "map_fit_objects", linkFitObjects.href = "#", linkFitObjects.title = la.FIT_OBJECTS_ON_MAP, linkFitObjects.className = "", iconFitObjects = L.DomUtil.create("span", "", linkFitObjects), iconFitObjects.className = "icon-fit-objects";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkFitObjects, "dblclick", a), L.DomEvent.on(linkFitObjects, "mousedown", a), L.DomEvent.on(linkFitObjects, "click", function(e) {
                fitObjectsOnMap()
            }), linkRuler = L.DomUtil.create("a", "", t), linkRuler.id = "map_ruler", linkRuler.href = "#", linkRuler.title = la.RULER, linkRuler.className = "", iconRuler = L.DomUtil.create("span", "", linkRuler), iconRuler.className = "icon-ruler enable";
            a = L.DomEvent.stopPropagation;
            L.DomEvent.on(linkRuler, "dblclick", a), L.DomEvent.on(linkRuler, "mousedown", a), L.DomEvent.on(linkRuler, "click", function(e) {
                utilsRuler(), 1 == utilsRulerData.enabled ? iconRuler.className = "icon-ruler" : iconRuler.className = "icon-ruler enable"
            }), linkMeasure = L.DomUtil.create("a", "", t), linkMeasure.id = "map_measure", linkMeasure.href = "#", linkMeasure.title = la.MEASURE_AREA, linkMeasure.className = "", iconMeasure = L.DomUtil.create("span", "", linkMeasure), iconMeasure.className = "icon-measure enable";
            var a = L.DomEvent.stopPropagation;
            return L.DomEvent.on(linkMeasure, "dblclick", a), L.DomEvent.on(linkMeasure, "mousedown", a), L.DomEvent.on(linkMeasure, "click", function(e) {
                utilsArea(), 1 == utilsAreaData.enabled ? iconMeasure.className = "icon-measure" : iconMeasure.className = "icon-measure enable"
            }), t
        }
    })
}

function initGraph(e) {
    if (e) {
        var t = e.data,
            a = e.units;
        if ("logic" == e.result_type) var o = !0,
            i = !1;
        else var o = !1,
            i = !1
    } else var t = [],
        a = "",
        o = !1,
        i = !1;
    var s = {
        xaxis: {
            mode: "time",
            zoomRange: [3e4, 2592e6]
        },
        yaxis: {
            tickFormatter: function(t) {
                var o = "";
                return e && (o = Math.round(100 * t) / 100 + " " + a), o
            },
            zoomRange: [0, 0],
            panRange: !1
        },
        selection: {
            mode: "x"
        },
        crosshair: {
            mode: "x"
        },
        lines: {
            show: !0,
            lineWidth: 1,
            fill: !0,
            fillColor: "rgba(43,130,212,0.3)",
            steps: o
        },
        series: {
            lines: {
                show: !0
            },
            points: {
                show: i,
                radius: 1
            }
        },
        colors: ["#2b82d4"],
        grid: {
            hoverable: !0,
            autoHighlight: !0,
            clickable: !0
        },
        zoom: {
            animate: !0,
            trigger: "dblclick",
            amount: 3
        },
        pan: {
            interactive: !1,
            animate: !0
        }
    };
    historyGraphPlot = $.plot($("#bottom_panel_graph_plot"), [t], s), $("#bottom_panel_graph_plot").unbind("plothover"), $("#bottom_panel_graph_plot").bind("plothover", function(e, o, i) {
        if (i) {
            var s = i.datapoint[0],
                n = historyRouteData.graph.data_index[s],
                l = historyRouteData.route[n].dt_tracker;
            document.getElementById("bottom_panel_graph_label").innerHTML = t[n][1] + " " + a + " - " + l
        }
    }), $("#bottom_panel_graph_plot").unbind("plotselected"), $("#bottom_panel_graph_plot").bind("plotselected", function(e, a) {
        historyGraphPlot = $.plot($("#bottom_panel_graph_plot"), [t], $.extend(!0, {}, s, {
            xaxis: {
                min: a.xaxis.from,
                max: a.xaxis.to
            }
        }))
    }), $("#bottom_panel_graph_plot").unbind("plotclick"), $("#bottom_panel_graph_plot").bind("plotclick", function(e, o, i) {
        if (i) {
            var s = i.datapoint[0],
                n = historyRouteData.graph.data_index[s],
                l = historyRouteData.route[n].dt_tracker;
            document.getElementById("bottom_panel_graph_label").innerHTML = t[n][1] + " " + a + " - " + l, historyRouteData.play.position = n, historyRoutePanToPoint(n), historyRouteAddPointMarkerToMap(n), 0 == historyRouteData.play.status && historyRouteShowPoint(n)
        }
    })
}

function graphSetCrosshair(e) {
    var t = parseInt(historyGraphPlot.pointOffset({
            x: e,
            y: 0
        }).left, 10) - historyGraphPlot.getPlotOffset().left,
        a = historyGraphPlot.width(),
        o = parseInt(a / 2, 10);
    t > a - o && historyGraphPlot.pan({
        left: t - (a - o),
        top: 0
    }), t < o && historyGraphPlot.pan({
        left: t - o,
        top: 0
    }), historyGraphPlot.setCrosshair({
        x: e,
        y: 0
    })
}

function graphPanLeft() {
    historyGraphPlot.pan({
        left: -100
    })
}

function graphPanRight() {
    historyGraphPlot.pan({
        left: 100
    })
}

function graphZoomIn() {
    historyGraphPlot.zoom()
}

function graphZoomOut() {
    historyGraphPlot.zoomOut()
}

function initSelectList(e) {
    switch (e) {
        case "map_layer_list":
            (n = document.getElementById("map_layer")).options.length = 0, gsValues.map_osm && n.options.add(new Option("OSM Map", "osm")), gsValues.map_bing && (n.options.add(new Option("Bing Road", "broad")), n.options.add(new Option("Bing Aerial", "baer")), n.options.add(new Option("Bing Hybrid", "bhyb"))), gsValues.map_google && (n.options.add(new Option("Google Streets", "gmap")), n.options.add(new Option("Google Satellite", "gsat")), n.options.add(new Option("Google Hybrid", "ghyb")), n.options.add(new Option("Google Terrain", "gter"))), gsValues.map_mapbox && (n.options.add(new Option("Mapbox Streets", "mbmap")), n.options.add(new Option("Mapbox Satellite", "mbsat"))), gsValues.map_yandex && n.options.add(new Option("Yandex", "yandex"));
            for (var t = 0; t < gsValues.map_custom.length; t++) {
                var a = gsValues.map_custom[t].layer_id,
                    o = gsValues.map_custom[t].name;
                n.options.add(new Option(o, a))
            }
            break;
        case "subaccounts_marker_list":
            n = document.getElementById("dialog_settings_subaccount_available_markers");
            multiselectClear(n);
            i = getGroupsPlacesArray("markers");
            multiselectSetGroups(n, i);
            break;
        case "events_route_list":
            n = document.getElementById("dialog_settings_event_routes");
            multiselectClear(n);
            i = getGroupsPlacesArray("routes");
            multiselectSetGroups(n, i);
            break;
        case "subaccounts_route_list":
            n = document.getElementById("dialog_settings_subaccount_available_routes");
            multiselectClear(n);
            i = getGroupsPlacesArray("routes");
            multiselectSetGroups(n, i);
            break;
        case "events_zone_list":
            n = document.getElementById("dialog_settings_event_zones");
            multiselectClear(n);
            i = getGroupsPlacesArray("zones");
            multiselectSetGroups(n, i);
            break;
        case "subaccounts_zone_list":
            n = document.getElementById("dialog_settings_subaccount_available_zones");
            multiselectClear(n);
            i = getGroupsPlacesArray("zones");
            multiselectSetGroups(n, i);
            break;
        case "report_zone_list":
            n = document.getElementById("dialog_report_zone_list");
            multiselectClear(n);
            var i = getGroupsPlacesArray("zones");
            multiselectSetGroups(n, i);
            break;
        case "group_object_list":
            (n = document.getElementById("dialog_settings_object_group_objects")).options.length = 0;
            for (var s in settingsObjectData) "true" == (r = settingsObjectData[s]).active && n.options.add(new Option(r.name, s));
            sortSelectList(n);
            break;
        case "events_object_list":
            n = document.getElementById("dialog_settings_event_objects");
            multiselectClear(n);
            l = getGroupsObjectsArray();
            multiselectSetGroups(n, l);
            break;
        case "subaccounts_object_list":
            n = document.getElementById("dialog_settings_subaccount_available_objects");
            multiselectClear(n);
            l = getGroupsObjectsArray();
            multiselectSetGroups(n, l);
            break;
        case "history_object_list":
            (n = document.getElementById("side_panel_history_object_list")).options.length = 0;
            for (var s in settingsObjectData) "true" == (r = settingsObjectData[s]).active && n.options.add(new Option(r.name, s));
            sortSelectList(n);
            break;
        case "report_object_list":
            var n = document.getElementById("dialog_report_object_list");
            multiselectClear(n);
            var l = getGroupsObjectsArray();
            multiselectSetGroups(n, l);
            break;
        case "rilogbook_object_list":
            (n = document.getElementById("dialog_rilogbook_object_list")).options.length = 0;
            for (var s in settingsObjectData) "true" == (r = settingsObjectData[s]).active && n.options.add(new Option(r.name, s));
            sortSelectList(n), n.options.add(new Option(la.ALL_OBJECTS, ""), 0), n.value = "";
            break;
        case "dtc_object_list":
            (n = document.getElementById("dialog_dtc_object_list")).options.length = 0;
            for (var s in settingsObjectData) "true" == (r = settingsObjectData[s]).active && n.options.add(new Option(r.name, s));
            sortSelectList(n), n.options.add(new Option(la.ALL_OBJECTS, ""), 0), n.value = "";
            break;
        case "cmd_object_list":
            (n = document.getElementById("cmd_object_list")).options.length = 0;
            for (var s in settingsObjectData) "true" == (r = settingsObjectData[s]).active && n.options.add(new Option(r.name, s));
            sortSelectList(n);
            break;
        case "gallery_object_list":
            (n = document.getElementById("dialog_image_gallery_object_list")).options.length = 0;
            for (var s in settingsObjectData) "true" == (r = settingsObjectData[s]).active && n.options.add(new Option(r.name, s));
            sortSelectList(n), n.options.add(new Option(la.ALL_OBJECTS, ""), 0), n.value = "";
            break;
        case "object_device_list":
            (n = document.getElementById("dialog_settings_object_edit_device")).options.length = 0;
            for (var s in gsValues.device_list) {
                var r = gsValues.device_list[s];
                n.options.add(new Option(r.name, r.name))
            }
            break;
        case "object_group_list":
            (n = document.getElementById("dialog_settings_object_edit_group")).options.length = 0;
            for (var s in settingsObjectGroupData)(v = settingsObjectGroupData[s]).name != la.UNGROUPED && n.options.add(new Option(v.name, s));
            sortSelectList(n), n.options.add(new Option(la.UNGROUPED, 0), 0);
            break;
        case "object_driver_list":
            (n = document.getElementById("dialog_settings_object_edit_driver")).options.length = 0;
            for (var s in settingsObjectDriverData) {
                var d = settingsObjectDriverData[s];
                n.options.add(new Option(d.name, s))
            }
            sortSelectList(n), n.options.add(new Option(la.AUTO_ASSIGN, 0), 0), n.options.add(new Option(la.NO_DRIVER, -1), 0);
            break;
        case "object_trailer_list":
            (n = document.getElementById("dialog_settings_object_edit_trailer")).options.length = 0;
            for (var s in settingsObjectTrailerData) {
                var _ = settingsObjectTrailerData[s];
                n.options.add(new Option(_.name, s))
            }
            sortSelectList(n), n.options.add(new Option(la.AUTO_ASSIGN, 0), 0), n.options.add(new Option(la.NO_TRAILER, -1), 0);
            break;
        case "email_sms_template_list":
            var c = document.getElementById("dialog_settings_event_notify_email_template");
            c.options.length = 0;
            var g = document.getElementById("dialog_settings_event_notify_sms_template");
            g.options.length = 0;
            for (var s in settingsTemplateData) {
                var m = settingsTemplateData[s];
                c.options.add(new Option(m.name, s)), g.options.add(new Option(m.name, s))
            }
            sortSelectList(c), sortSelectList(g), c.options.add(new Option(la.DEFAULT, 0), 0), g.options.add(new Option(la.DEFAULT, 0), 0);
            break;
        case "places_group_list":
            var u = document.getElementById("dialog_places_marker_group");
            u.options.length = 0;
            var p = document.getElementById("dialog_places_route_group");
            p.options.length = 0;
            var y = document.getElementById("dialog_places_zone_group");
            y.options.length = 0;
            for (var s in placesGroupData.groups) {
                var v = placesGroupData.groups[s];
                v.name != la.UNGROUPED && (u.options.add(new Option(v.name, s)), p.options.add(new Option(v.name, s)), y.options.add(new Option(v.name, s)))
            }
            sortSelectList(u), sortSelectList(p), sortSelectList(y), u.options.add(new Option(la.UNGROUPED, 0), 0), p.options.add(new Option(la.UNGROUPED, 0), 0), y.options.add(new Option(la.UNGROUPED, 0), 0)
    }
}

function resizeGrids() {
    resizeGridObjects(), resizeGridEvents(), resizeGridHistory()
}

function resizeGridObjects(e) {
    void 0 == e ? e = window.innerHeight - guiDragbars.objects : guiDragbars.objects = window.innerHeight - e, e < 292 && (e = 292), e > window.innerHeight - 180 && (e = window.innerHeight - 180);
    var t = window.innerHeight - e - 16,
        a = window.innerHeight - t - 164;
    $("#side_panel_objects_object_data_list_grid").setGridHeight(t - 20), $("#side_panel_objects_object_list_grid").setGridHeight(a), $("#side_panel_objects_dragbar").css("bottom", t + 1)
}

function resizeGridEvents(e) {
    void 0 == e ? e = window.innerHeight - guiDragbars.events : guiDragbars.events = window.innerHeight - e, e < 292 && (e = 292), e > window.innerHeight - 180 && (e = window.innerHeight - 180);
    var t = window.innerHeight - e - 16,
        a = window.innerHeight - t - 195;
    $("#side_panel_events_event_data_list_grid").setGridHeight(t - 20), $("#side_panel_events_event_list_grid").setGridHeight(a), $("#side_panel_events_dragbar").css("bottom", t + 1)
}

function resizeGridHistory(e) {
    void 0 == e ? e = window.innerHeight - guiDragbars.history : guiDragbars.history = window.innerHeight - e, e < 430 && (e = 430), e > window.innerHeight - 180 && (e = window.innerHeight - 180);
    var t = window.innerHeight - e - 16,
        a = window.innerHeight - t - 302;
    $("#side_panel_history_route_data_list_grid").setGridHeight(t - 20), $("#side_panel_history_route_detail_list_grid").setGridHeight(a), $("#side_panel_history_dragbar").css("bottom", t + 1)
}

function showHideLeftPanel() {
    "none" == document.getElementById("side_panel").style.display ? (document.getElementById("side_panel").style.display = "block", document.getElementById("bottom_panel").style.left = "365px", document.getElementById("side_panel_dragbar").style.left = "360px", document.getElementById("bottom_panel_dragbar").style.left = "365px", document.getElementById("map").style.left = "365px", document.getElementById("history_view_control").style.left = "413px", $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 384), setTimeout(function() {
        map.invalidateSize(!0)
    }, 200)) : (document.getElementById("side_panel").style.display = "none", document.getElementById("bottom_panel").style.left = "5px", document.getElementById("side_panel_dragbar").style.left = "0px", document.getElementById("bottom_panel_dragbar").style.left = "5px", document.getElementById("map").style.left = "5px", document.getElementById("history_view_control").style.left = "53px", $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 24), setTimeout(function() {
        map.invalidateSize(!0)
    }, 200))
}

function showBottomPanel(e) {
    void 0 === e && (e = !0), document.getElementById("bottom_panel").style.display = "block", guiDragbars.bottom_panel < 178 && (guiDragbars.bottom_panel = 178), guiDragbars.bottom_panel > window.innerHeight / 2 && (guiDragbars.bottom_panel = window.innerHeight / 2), $("#bottom_panel").css("height", guiDragbars.bottom_panel), document.getElementById("map").style.bottom = parseInt(guiDragbars.bottom_panel) + 5 + "px", document.getElementById("bottom_panel_dragbar").style.bottom = guiDragbars.bottom_panel + "px", $("#bottom_panel_msg_list_grid").setGridHeight(guiDragbars.bottom_panel - 99), $("#bottom_panel_graph_plot").css("height", guiDragbars.bottom_panel - 75), $("#bottom_panel_dragbar").css("cursor", "row-resize"), document.getElementById("street_view_control").style.bottom = parseInt(guiDragbars.bottom_panel) + 16 + "px", 1 == e && map.invalidateSize(!0)
}

function hideBottomPanel(e) {
    void 0 === e && (e = !0), document.getElementById("bottom_panel").style.display = "none", document.getElementById("map").style.bottom = "5px", document.getElementById("bottom_panel_dragbar").style.bottom = "0px", $("#bottom_panel_dragbar").css("cursor", ""), document.getElementById("street_view_control").style.bottom = "16px", 1 == e && map.invalidateSize(!0)
}

function resizeBottomPanel(e) {
    guiDragbars.bottom_panel = window.innerHeight - e, guiDragbars.bottom_panel -= 3, guiDragbars.bottom_panel < 150 ? hideBottomPanel() : showBottomPanel(!1)
}

function initGrids() {
    function e(e, t, a) {
        return "gr" == e ? e = ">" : "eq" == e ? e = "=" : "lw" == e && (e = "<"), e
    }

    function t(e, t, a) {
        return e = e.substring(0, 10) == moment().format("YYYY-MM-DD") ? e.substring(11, 19) : e.substring(2, 10)
    }
    $("#settings_main_object_list_grid").jqGrid({
        url: "func/fn_settings.objects.php?cmd=load_object_list",
        datatype: "json",
        colNames: [la.NAME, la.IMEI, la.ACTIVE, la.EXPIRES_ON, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 218
        }, {
            name: "imei",
            index: "imei",
            width: 160
        }, {
            name: "active",
            index: "active",
            width: 90,
            align: "center"
        }, {
            name: "object_expire_dt",
            index: "object_expire_dt",
            width: 110,
            align: "center"
        }, {
            name: "modify",
            index: "modify",
            width: 75,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_object_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "351px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_object_list_grid").jqGrid("navGrid", "#settings_main_object_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectAdd("open")
        }
    }), $("#settings_main_object_list_grid").navButtonAdd("#settings_main_object_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_object_list_grid_action_menu_button"
    }), $("#settings_main_object_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_object_list_grid_action_menu").hide(), $("#settings_main_object_list_grid_action_menu_button").click(function() {
        return $("#settings_main_object_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_object_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_object_sensor_list_grid").jqGrid({
        url: "func/fn_settings.sensors.php",
        datatype: "json",
        colNames: [la.NAME, la.TYPE, la.PARAMETER, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 220,
            sortable: !0
        }, {
            name: "type",
            index: "type",
            width: 205,
            align: "center",
            sortable: !1
        }, {
            name: "param",
            index: "param",
            width: 158,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 512,
        pager: "#settings_object_sensor_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "690",
        height: "347",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_object_sensor_list_grid").jqGrid("navGrid", "#settings_object_sensor_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectSensorProperties("add")
        }
    }), $("#settings_object_sensor_list_grid").navButtonAdd("#settings_object_sensor_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_object_sensor_list_grid_action_menu_button"
    }), $("#settings_object_sensor_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_object_sensor_list_grid_action_menu").hide(), $("#settings_object_sensor_list_grid_action_menu_button").click(function() {
        return $("#settings_object_sensor_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_object_sensor_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_object_sensor_calibration_list_grid").jqGrid({
        datatype: "local",
        colNames: ["X", "Y", ""],
        colModel: [{
            name: "x",
            index: "x",
            width: 111,
            sortable: !0,
            sorttype: "int"
        }, {
            name: "y",
            index: "y",
            width: 110,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }],
        width: "285",
        height: "306",
        rowNum: 100,
        shrinkToFit: !1
    }), $("#settings_object_service_list_grid").jqGrid({
        url: "func/fn_settings.service.php",
        datatype: "json",
        colNames: [la.NAME, la.STATUS, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 220
        }, {
            name: "status",
            index: "status",
            width: 368,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 512,
        pager: "#settings_object_service_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "690",
        height: "347",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_object_service_list_grid").jqGrid("navGrid", "#settings_object_service_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectServiceProperties("add")
        }
    }), $("#settings_object_service_list_grid").navButtonAdd("#settings_object_service_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_object_service_list_grid_action_menu_button"
    }), $("#settings_object_service_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_object_service_list_grid_action_menu").hide(), $("#settings_object_service_list_grid_action_menu_button").click(function() {
        return $("#settings_object_service_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_object_service_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_object_custom_fields_list_grid").jqGrid({
        url: "func/fn_settings.customfields.php",
        datatype: "json",
        colNames: [la.NAME, la.VALUE, la.DATA_LIST, la.POPUP, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 220,
            sortable: !0
        }, {
            name: "value",
            index: "value",
            width: 178,
            align: "center",
            sortable: !0
        }, {
            name: "data_list",
            index: "data_list",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "popup",
            index: "popup",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 512,
        pager: "#settings_object_custom_fields_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "690",
        height: "347",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_object_custom_fields_list_grid").jqGrid("navGrid", "#settings_object_custom_fields_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectCustomFieldProperties("add")
        }
    }), $("#settings_object_custom_fields_list_grid").navButtonAdd("#settings_object_custom_fields_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_object_custom_fields_list_grid_action_menu_button"
    }), $("#settings_object_custom_fields_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_object_custom_fields_list_grid_action_menu").hide(), $("#settings_object_custom_fields_list_grid_action_menu_button").click(function() {
        return $("#settings_object_custom_fields_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_object_custom_fields_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_object_info_list_grid").jqGrid({
        url: "func/fn_settings.objects.php",
        datatype: "json",
        colNames: [la.DATA, la.VALUE],
        colModel: [{
            name: "data",
            index: "data",
            width: 170,
            sortable: !1
        }, {
            name: "value",
            index: "value",
            width: 493,
            sortable: !1
        }],
        rowNum: 512,
        pager: "#settings_object_info_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "data",
        sortorder: "asc",
        viewrecords: !0,
        width: "690",
        height: "347",
        shrinkToFit: !1
    }), $("#settings_object_info_list_grid").jqGrid("navGrid", "#settings_object_info_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#settings_main_object_group_list_grid").jqGrid({
        url: "func/fn_settings.groups.php?cmd=load_object_group_list",
        datatype: "json",
        colNames: [la.NAME, la.OBJECTS, la.DESCRIPTION, ""],
        colModel: [{
            name: "group_name",
            index: "group_name",
            width: 218,
            sortable: !0
        }, {
            name: "objects",
            index: "objects",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "description",
            index: "description",
            width: 305,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_object_group_list_grid_pager",
        sortname: "group_name",
        sortorder: "asc",
        viewrecords: !0,
        height: "351px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_object_group_list_grid").jqGrid("navGrid", "#settings_main_object_group_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectGroupProperties("add")
        }
    }), $("#settings_main_object_group_list_grid").navButtonAdd("#settings_main_object_group_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_object_group_list_grid_action_menu_button"
    }), $("#settings_main_object_group_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_object_group_list_grid_action_menu").hide(), $("#settings_main_object_group_list_grid_action_menu_button").click(function() {
        return $("#settings_main_object_group_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_object_group_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_main_object_driver_list_grid").jqGrid({
        url: "func/fn_settings.drivers.php?cmd=load_object_driver_list",
        datatype: "json",
        colNames: [la.NAME, la.ID_NUMBER, la.DESCRIPTION, ""],
        colModel: [{
            name: "driver_name",
            index: "driver_name",
            width: 218,
            sortable: !0
        }, {
            name: "idn",
            index: "idn",
            width: 135,
            sortable: !1
        }, {
            name: "description",
            index: "description",
            width: 260,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_object_driver_list_grid_pager",
        sortname: "driver_name",
        sortorder: "asc",
        viewrecords: !0,
        height: "351px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_object_driver_list_grid").jqGrid("navGrid", "#settings_main_object_driver_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectDriverProperties("add")
        }
    }), $("#settings_main_object_driver_list_grid").navButtonAdd("#settings_main_object_driver_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_object_driver_list_grid_action_menu_button"
    }), $("#settings_main_object_driver_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_object_driver_list_grid_action_menu").hide(), $("#settings_main_object_driver_list_grid_action_menu_button").click(function() {
        return $("#settings_main_object_driver_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_object_driver_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_main_object_passenger_list_grid").jqGrid({
        url: "func/fn_settings.passengers.php?cmd=load_object_passenger_list",
        datatype: "json",
        colNames: [la.NAME, la.ID_NUMBER, la.DESCRIPTION, ""],
        colModel: [{
            name: "passenger_name",
            index: "passenger_name",
            width: 218,
            sortable: !0
        }, {
            name: "idn",
            index: "idn",
            width: 135,
            sortable: !1
        }, {
            name: "description",
            index: "description",
            width: 260,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_object_passenger_list_grid_pager",
        sortname: "passenger_name",
        sortorder: "asc",
        viewrecords: !0,
        height: "351px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_object_passenger_list_grid").jqGrid("navGrid", "#settings_main_object_passenger_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectPassengerProperties("add")
        }
    }), $("#settings_main_object_passenger_list_grid").navButtonAdd("#settings_main_object_passenger_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_object_passenger_list_grid_action_menu_button"
    }), $("#settings_main_object_passenger_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_object_passenger_list_grid_action_menu").hide(), $("#settings_main_object_passenger_list_grid_action_menu_button").click(function() {
        return $("#settings_main_object_passenger_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_object_passenger_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_main_object_trailer_list_grid").jqGrid({
        url: "func/fn_settings.trailers.php?cmd=load_object_trailer_list",
        datatype: "json",
        colNames: [la.NAME, la.DESCRIPTION, ""],
        colModel: [{
            name: "trailer_name",
            index: "trailer_name",
            width: 218,
            sortable: !0
        }, {
            name: "description",
            index: "description",
            width: 400,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_object_trailer_list_grid_pager",
        sortname: "trailer_name",
        sortorder: "asc",
        viewrecords: !0,
        height: "351px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_object_trailer_list_grid").jqGrid("navGrid", "#settings_main_object_trailer_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsObjectTrailerProperties("add")
        }
    }), $("#settings_main_object_trailer_list_grid").navButtonAdd("#settings_main_object_trailer_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_object_trailer_list_grid_action_menu_button"
    }), $("#settings_main_object_trailer_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_object_trailer_list_grid_action_menu").hide(), $("#settings_main_object_trailer_list_grid_action_menu_button").click(function() {
        return $("#settings_main_object_trailer_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_object_trailer_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_main_events_event_list_grid").jqGrid({
        url: "func/fn_settings.events.php?cmd=load_event_list",
        datatype: "json",
        colNames: [la.NAME, la.ACTIVE, la.SYSTEM, la.EMAIL, la.SMS, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 243,
            sortable: !0
        }, {
            name: "active",
            index: "active",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "notify",
            index: "notify",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "email",
            index: "email",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "sms",
            index: "sms",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_events_event_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "447px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_events_event_list_grid").jqGrid("navGrid", "#settings_main_events_event_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsEventProperties("add")
        }
    }), $("#settings_main_events_event_list_grid").navButtonAdd("#settings_main_events_event_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_events_event_list_grid_action_menu_button"
    }), $("#settings_main_events_event_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_events_event_list_grid_action_menu").hide(), $("#settings_main_events_event_list_grid_action_menu_button").click(function() {
        return $("#settings_main_events_event_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_events_event_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_event_param_sensor_condition_list_grid").jqGrid({
        datatype: "local",
        colNames: [la.SOURCE, "", la.VALUE, ""],
        colModel: [{
            name: "src",
            index: "src",
            width: 94,
            sortable: !0,
            sorttype: "text"
        }, {
            name: "cn",
            index: "cn",
            width: 35,
            align: "center",
            sortable: !1,
            formatter: e
        }, {
            name: "val",
            index: "val",
            width: 80,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }],
        width: "276",
        height: "209",
        rowNum: 15,
        shrinkToFit: !1
    }), $("#settings_main_templates_template_list_grid").jqGrid({
        url: "func/fn_settings.templates.php?cmd=load_template_list",
        datatype: "json",
        colNames: [la.NAME, la.DESCRIPTION, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 243,
            sortable: !0
        }, {
            name: "description",
            index: "description",
            width: 375,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_templates_template_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "447px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_templates_template_list_grid").jqGrid("navGrid", "#settings_main_templates_template_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsTemplateProperties("add")
        }
    }), $("#settings_main_templates_template_list_grid").navButtonAdd("#settings_main_templates_template_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_templates_template_list_grid_action_menu_button"
    }), $("#settings_main_templates_template_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_templates_template_list_grid_action_menu").hide(), $("#settings_main_templates_template_list_grid_action_menu_button").click(function() {
        return $("#settings_main_templates_template_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_templates_template_list_grid_action_menu").hide()
        }), !1
    }), $("#settings_main_subaccount_list_grid").jqGrid({
        url: "func/fn_settings.subaccounts.php?cmd=load_subaccount_list",
        datatype: "json",
        colNames: [la.EMAIL, la.ACTIVE, la.OBJECTS, la.PLACES, ""],
        colModel: [{
            name: "email",
            index: "email",
            width: 288,
            sortable: !0
        }, {
            name: "active",
            index: "active",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "objects",
            index: "objects",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "places",
            index: "places",
            width: 140,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#settings_main_subaccount_list_grid_pager",
        sortname: "email",
        sortorder: "asc",
        viewrecords: !0,
        height: "397px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#settings_main_subaccount_list_grid").jqGrid("navGrid", "#settings_main_subaccount_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            settingsSubaccountProperties("add")
        }
    }), $("#settings_main_subaccount_list_grid").navButtonAdd("#settings_main_subaccount_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "settings_main_subaccount_list_grid_action_menu_button"
    }), $("#settings_main_subaccount_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#settings_main_subaccount_list_grid_action_menu").hide(), $("#settings_main_subaccount_list_grid_action_menu_button").click(function() {
        return $("#settings_main_subaccount_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#settings_main_subaccount_list_grid_action_menu").hide()
        }), !1
    });
    a = '<div style="float: left; margin-top: 2px; width: 25px;">';
    a += '<center><input id="object_group_visible_{0}" type="checkbox" onClick="objectGroupVisibleToggle({0});"></center>', a += "</div>", a += '<div style="float: left; margin-top: 2px; width: 25px;">', a += '<center><input id="object_group_follow_{0}" type="checkbox" onClick="objectGroupFollowToggle({0});"></center>', a += "</div>", a += '<div style="float: right;"><span id="object_group_name_{0}"></span> ({1})</div>', $("#side_panel_objects_object_list_grid").jqGrid({
        datatype: "local",
        colNames: ["", "", "", '<a href="#" onclick="objectVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px" /></a>', '<a href="#" onclick="objectFollowAllToggle();"><img title="' + la.FOLLOW_UNFOLLOW_ALL + '" src="theme/images/follow.svg" width="14px" /></a>', "", la.OBJECT, ""],
        colModel: [{
            name: "search",
            index: "search",
            hidden: !0
        }, {
            name: "name_sort",
            index: "name_sort",
            hidden: !0
        }, {
            name: "group_id",
            index: "group_id",
            sorttype: function(e) {
                return 0 == e ? String.fromCharCode(0) : settingsObjectGroupData[e].name
            }
        }, {
            name: "show",
            index: "show",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "follow",
            index: "follow",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "icon",
            index: "icon",
            width: 28,
            sortable: !1
        }, {
            name: "name",
            index: "name_sort",
            width: 215,
            title: !1
        }, {
            name: "menu",
            index: "menu",
            width: 15,
            sortable: !1,
            align: "center"
        }],
        rowNum: 12288,
        viewrecords: !0,
        grouping: !0,
        groupingView: {
            groupField: ["group_id"],
            groupColumnShow: [!1],
            groupText: [a],
            groupCollapse: settingsUserData.groups_collapsed.objects,
            groupOrder: ["asc"],
            groupDataSorted: [!0]
        },
        width: "340",
        shrinkToFit: !1,
        loadComplete: function(e) {
            for (var t in settingsObjectGroupData) null != document.getElementById("object_group_name_" + t) && (document.getElementById("object_group_name_" + t).innerHTML = settingsObjectGroupData[t].name);
            "" != objectsData && (objectAddAllToMap(), objectUpdateList());
            for (var a = $(this).getDataIDs(), o = 0; o < a.length; o++) {
                var i = a[o];
                $("#object_action_menu_" + i).click(function() {
                    return $("#side_panel_objects_action_menu").toggle().position({
                        my: "left top",
                        at: "right bottom",
                        of: this
                    }), menuOnItem = $(this).attr("tag"), $(document).one("click", function() {
                        $("#side_panel_objects_action_menu").hide()
                    }), !1
                })
            }
        },
        onCellSelect: function(e, t, a, o) {
            objectSelect(e), 5 == t ? objectPanToZoom(e) : objectPanTo(e)
        }
    }), $("#side_panel_objects_object_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width80">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_objects_object_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="objectReloadData();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="settingsObjectAdd(\'open\');">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_OBJECT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/object-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_objects_object_list_search").bind("keyup", function(e) {
        var t = $("#side_panel_objects_object_list_grid"),
            a = t.jqGrid("getGridParam", "postData");
        jQuery.extend(a, {
            filters: "",
            searchField: "search",
            searchOper: "cn",
            searchString: this.value.toLowerCase()
        }), t.jqGrid("setGridParam", {
            search: !0,
            postData: a
        }), t.trigger("reloadGrid")
    }), $("#side_panel_objects_object_data_list_grid").jqGrid({
        datatype: "local",
        colNames: [la.DATA, la.VALUE],
        colModel: [{
            name: "data",
            index: "data",
            width: 110,
            sortable: !1
        }, {
            name: "value",
            index: "value",
            width: 203,
            sortable: !1
        }],
        width: "340",
        height: "155",
        rowNum: 512,
        shrinkToFit: !1
    }), $("#side_panel_events_event_list_grid").jqGrid({
        url: "func/fn_events.php?cmd=load_event_list",
        datatype: "json",
        colNames: [la.TIME, la.OBJECT, la.EVENT],
        colModel: [{
            name: "dt_tracker",
            index: "dt_tracker",
            width: 50,
            sorttype: "datetime",
            formatter: t,
            align: "left"
        }, {
            name: "object",
            index: "object",
            width: 105,
            sortable: !1,
            align: "left"
        }, {
            name: "event",
            index: "event",
            width: 153,
            sortable: !1,
            align: "left"
        }],
        recordtext: "",
        emptyrecords: "",
        rowNum: 25,
        rowList: [25, 50, 75, 100, 200],
        pager: "#side_panel_events_event_list_grid_pager",
        sortname: "dt_tracker",
        sortorder: "desc",
        viewrecords: !0,
        width: "340",
        shrinkToFit: !1,
        onSelectRow: function(e) {
            eventsShowEvent(e)
        }
    }), $("#side_panel_events_event_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width80">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_events_event_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="eventsReloadData();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="eventsDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_EVENTS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_events_event_list_search").bind("keyup", function(e) {
        $("#side_panel_events_event_list_grid").setGridParam({
            url: "func/fn_events.php?cmd=load_event_list&s=" + this.value
        }), $("#side_panel_events_event_list_grid").trigger("reloadGrid")
    }), $("#side_panel_events_event_data_list_grid").jqGrid({
        datatype: "local",
        colNames: [la.DATA, la.VALUE],
        colModel: [{
            name: "data",
            index: "data",
            width: 110,
            sortable: !1
        }, {
            name: "value",
            index: "value",
            width: 203,
            sortable: !1
        }],
        width: "340",
        height: "155",
        rowNum: 512,
        shrinkToFit: !1
    }), $("#places_group_list_grid").jqGrid({
        url: "func/fn_places.php?cmd=load_places_group_list",
        datatype: "json",
        colNames: [la.NAME, la.PLACES, la.DESCRIPTION, ""],
        colModel: [{
            name: "group_name",
            index: "group_name",
            width: 228,
            sortable: !0
        }, {
            name: "places",
            index: "places",
            width: 90,
            align: "center",
            sortable: !1
        }, {
            name: "description",
            index: "description",
            width: 295,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#places_group_list_grid_pager",
        sortname: "group_name",
        sortorder: "asc",
        viewrecords: !0,
        height: "311px",
        width: "720",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#places_group_list_grid").jqGrid("navGrid", "#places_group_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            placesGroupProperties("add")
        }
    }), $("#places_group_list_grid").navButtonAdd("#places_group_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "places_group_list_grid_action_menu_button"
    }), $("#places_group_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#places_group_list_grid_action_menu").hide(), $("#places_group_list_grid_action_menu_button").click(function() {
        return $("#places_group_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#places_group_list_grid_action_menu").hide()
        }), !1
    });
    a = '<div style="float: left; margin-top: 2px; width: 25px;">';
    a += '<center><input id="marker_group_visible_{0}" type="checkbox" onClick="markerGroupVisibleToggle({0});"></center>', a += "</div>", a += '<div style="float: right;"><span id="marker_group_name_{0}"></span> ({1})</div>', $("#side_panel_places_marker_list_grid").jqGrid({
        url: "func/fn_places.php?cmd=load_marker_list",
        datatype: "json",
        colNames: ["", "", '<a href="#" onclick="placesMarkerVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px"/></a>', "", la.NAME, ""],
        colModel: [{
            name: "marker_id",
            index: "marker_id",
            hidden: !0
        }, {
            name: "group_id",
            index: "group_id"
        }, {
            name: "show",
            index: "show",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "icon",
            index: "icon",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "name",
            index: "name",
            width: 218
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        recordtext: "",
        emptyrecords: "",
        rowNum: 50,
        rowList: [25, 50, 100, 200],
        pager: "#side_panel_places_marker_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "340",
        shrinkToFit: !1,
        grouping: !0,
        groupingView: {
            groupField: ["group_id"],
            groupColumnShow: [!1],
            groupText: [a],
            groupCollapse: settingsUserData.groups_collapsed.markers,
            groupOrder: ["asc"],
            groupDataSorted: [!0]
        },
        onSelectRow: function(e) {
            placesMarkerPanTo($(this).jqGrid("getCell", e, "marker_id"))
        },
        loadComplete: function(e) {
            for (var t in placesGroupData.groups) null != document.getElementById("marker_group_name_" + t) && (document.getElementById("marker_group_name_" + t).innerHTML = placesGroupData.groups[t].name);
            placesMarkerSetListCheckbox()
        }
    }), $("#side_panel_places_marker_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width44">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_places_marker_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesMarkerReload();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesMarkerNew();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_MARKER + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/marker-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesGroupOpen();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.GROUPS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/groups.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesImport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.IMPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/import.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesMarkerDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_MARKERS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_places_marker_list_search").bind("keyup", function(e) {
        $("#side_panel_places_marker_list_grid").setGridParam({
            url: "func/fn_places.php?cmd=load_marker_list&s=" + this.value
        }), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"), placesMarkerSearchMap(this.value)
    }), $(window).bind("resize", function() {
        $("#side_panel_places_marker_list_grid").setGridHeight($(window).height() - 208)
    }).trigger("resize");
    a = '<div style="float: left; margin-top: 2px; width: 25px;">';
    a += '<center><input id="route_group_visible_{0}" type="checkbox" onClick="routeGroupVisibleToggle({0});"></center>', a += "</div>", a += '<div style="float: right;"><span id="route_group_name_{0}"></span> ({1})</div>', $("#side_panel_places_route_list_grid").jqGrid({
        url: "func/fn_places.php?cmd=load_route_list",
        datatype: "json",
        colNames: ["", "", '<a href="#" onclick="placesRouteVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px"/></a>', "", la.NAME, ""],
        colModel: [{
            name: "route_id",
            index: "route_id",
            hidden: !0
        }, {
            name: "group_id",
            index: "group_id"
        }, {
            name: "show",
            index: "show",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "icon",
            index: "icon",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "name",
            index: "name",
            width: 218
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        recordtext: "",
        emptyrecords: "",
        rowNum: 50,
        rowList: [25, 50, 100, 200],
        pager: "#side_panel_places_route_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "340",
        shrinkToFit: !1,
        grouping: !0,
        groupingView: {
            groupField: ["group_id"],
            groupColumnShow: [!1],
            groupText: [a],
            groupCollapse: settingsUserData.groups_collapsed.routes,
            groupOrder: ["asc"],
            groupDataSorted: [!0]
        },
        onSelectRow: function(e) {
            placesRoutePanTo($(this).jqGrid("getCell", e, "route_id"))
        },
        loadComplete: function(e) {
            for (var t in placesGroupData.groups) null != document.getElementById("route_group_name_" + t) && (document.getElementById("route_group_name_" + t).innerHTML = placesGroupData.groups[t].name);
            placesRouteSetListCheckbox()
        }
    }), $("#side_panel_places_route_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width44">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_places_route_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesRouteReload();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesRouteNew();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_ROUTE + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/route-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesGroupOpen();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.GROUPS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/groups.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesImport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.IMPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/import.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesRouteDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_ROUTES + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_places_route_list_search").bind("keyup", function(e) {
        $("#side_panel_places_route_list_grid").setGridParam({
            url: "func/fn_places.php?cmd=load_route_list&s=" + this.value
        }), $("#side_panel_places_route_list_grid").trigger("reloadGrid"), placesRouteSearchMap(this.value)
    }), $(window).bind("resize", function() {
        $("#side_panel_places_route_list_grid").setGridHeight($(window).height() - 208)
    }).trigger("resize");
    var a = '<div style="float: left; margin-top: 2px; width: 25px;">';
    a += '<center><input id="zone_group_visible_{0}" type="checkbox" onClick="zoneGroupVisibleToggle({0});"></center>', a += "</div>", a += '<div style="float: right;"><span id="zone_group_name_{0}"></span> ({1})</div>', $("#side_panel_places_zone_list_grid").jqGrid({
        url: "func/fn_places.php?cmd=load_zone_list",
        datatype: "json",
        colNames: ["", "", '<a href="#" onclick="placesZoneVisibleAllToggle();"><img title="' + la.SHOW_HIDE_ALL + '" src="theme/images/eye.svg" width="14px"/></a>', "", la.NAME, ""],
        colModel: [{
            name: "zone_id",
            index: "zone_id",
            hidden: !0
        }, {
            name: "group_id",
            index: "group_id"
        }, {
            name: "show",
            index: "show",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "icon",
            index: "icon",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "name",
            index: "name",
            width: 218
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        recordtext: "",
        emptyrecords: "",
        rowNum: 50,
        rowList: [25, 50, 100, 200],
        pager: "#side_panel_places_zone_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "340",
        shrinkToFit: !1,
        grouping: !0,
        groupingView: {
            groupField: ["group_id"],
            groupColumnShow: [!1],
            groupText: [a],
            groupCollapse: settingsUserData.groups_collapsed.zones,
            groupOrder: ["asc"],
            groupDataSorted: [!0]
        },
        onSelectRow: function(e) {
            placesZonePanTo($(this).jqGrid("getCell", e, "zone_id"))
        },
        loadComplete: function(e) {
            for (var t in placesGroupData.groups) null != document.getElementById("zone_group_name_" + t) && (document.getElementById("zone_group_name_" + t).innerHTML = placesGroupData.groups[t].name);
            placesZoneSetListCheckbox()
        }
    }), $("#side_panel_places_zone_list_grid").setCaption('<div class="row4">\t\t\t\t\t\t\t\t\t<div class="width44">\t\t\t\t\t\t\t\t\t\t<input id="side_panel_places_zone_list_search" class="inputbox-search" type="text" value="" placeholder="' + la.SEARCH + '" maxlength="25">\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="float-right">\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesZoneReload();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.RELOAD + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/refresh-color.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesZoneNew();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.ADD_ZONE + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/zone-add.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesGroupOpen();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.GROUPS + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/groups.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesImport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.IMPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/import.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesExport();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.EXPORT + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/export.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t\t<a href="#" onclick="placesZoneDeleteAll();">\t\t\t\t\t\t\t\t\t\t<div class="panel-button" title="' + la.DELETE_ALL_ZONES + '">\t\t\t\t\t\t\t\t\t\t\t<img src="theme/images/remove2.svg" width="16px" border="0"/>\t\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>'), $("#side_panel_places_zone_list_search").bind("keyup", function(e) {
        $("#side_panel_places_zone_list_grid").setGridParam({
            url: "func/fn_places.php?cmd=load_zone_list&s=" + this.value
        }), $("#side_panel_places_zone_list_grid").trigger("reloadGrid"), placesZoneSearchMap(this.value)
    }), $(window).bind("resize", function() {
        $("#side_panel_places_zone_list_grid").setGridHeight($(window).height() - 208)
    }).trigger("resize"), $("#side_panel_history_route_detail_list_grid").jqGrid({
        datatype: "local",
        colNames: ["", "", "", la.TIME, la.INFORMATION],
        colModel: [{
            name: "el_type",
            index: "el_type",
            hidden: !0
        }, {
            name: "el_id",
            index: "el_id",
            hidden: !0
        }, {
            name: "icon",
            index: "icon",
            width: 20,
            sortable: !1,
            align: "center"
        }, {
            name: "datetime",
            index: "datetime",
            width: 110,
            sortable: !1,
            datefmt: "Y-m-d H:i:s",
            align: "center"
        }, {
            name: "info",
            index: "info",
            width: 178,
            sortable: !1
        }],
        width: "340",
        height: "100%",
        rowNum: 12288,
        shrinkToFit: !1,
        loadComplete: function(e) {
            for (var t = $(this).getDataIDs(), a = historyRouteData.imei, o = 0; o < t.length; o++) {
                var i = t[o],
                    s = $(this).jqGrid("getCell", i, "el_type"),
                    n = $(this).jqGrid("getCell", i, "el_id");
                if ("point" == s) {
                    l = "<table>";
                    l += "<tr><td>" + la.ROUTE_LENGTH + ":</td><td>" + historyRouteData.route_length + " " + la.UNIT_DISTANCE + "</td></tr>", l += "<tr><td>" + la.MOVE_DURATION + ":</td><td>" + historyRouteData.drives_duration + "</td></tr>", l += "<tr><td>" + la.STOP_DURATION + ":</td><td>" + historyRouteData.stops_duration + "</td></tr>", l += "<tr><td>" + la.TOP_SPEED + ":</td><td>" + historyRouteData.top_speed + " " + la.UNIT_SPEED + "</td></tr>", l += "<tr><td>" + la.AVG_SPEED + ":</td><td>" + historyRouteData.avg_speed + " " + la.UNIT_SPEED + "</td></tr>", 0 != (r = historyRouteData.fuel_consumption) && (l += "<tr><td>" + la.FUEL_CONSUMPTION + ":</td><td>" + r + " " + la.UNIT_CAPACITY + "</td></tr>"), 0 != (d = historyRouteData.fuel_cost) && (l += "<tr><td>" + la.FUEL_COST + ":</td><td>" + d + " " + settingsUserData.currency + "</td></tr>"), 0 != getSensorFromType(a, "acc") && (l += "<tr><td>" + la.ENGINE_WORK + ":</td><td>" + historyRouteData.engine_work + "</td></tr>", l += "<tr><td>" + la.ENGINE_IDLE + ":</td><td>" + historyRouteData.engine_idle + "</td></tr>"), l += "</table>"
                } else if ("drive" == s) {
                    l = "<table>";
                    l += "<tr><td>" + la.ROUTE_LENGTH + ":</td><td>" + historyRouteData.drives[n].route_length + " " + la.UNIT_DISTANCE + "</td></tr>", l += "<tr><td>" + la.TOP_SPEED + ":</td><td>" + historyRouteData.drives[n].top_speed + " " + la.UNIT_SPEED + "</td></tr>", l += "<tr><td>" + la.AVG_SPEED + ":</td><td>" + historyRouteData.drives[n].avg_speed + " " + la.UNIT_SPEED + "</td></tr>", 0 != (r = historyRouteData.drives[n].fuel_consumption) && (l += "<tr><td>" + la.FUEL_CONSUMPTION + ":</td><td>" + r + " " + la.UNIT_CAPACITY + "</td></tr>"), 0 != (d = historyRouteData.drives[n].fuel_cost) && (l += "<tr><td>" + la.FUEL_COST + ":</td><td>" + d + " " + settingsUserData.currency + "</td></tr>"), l += "</table>"
                } else if ("stop" == s) {
                    var l = "<table>";
                    l += "<tr><td>" + la.CAME + ":</td><td>" + historyRouteData.stops[n].dt_start + "</td></tr>", l += "<tr><td>" + la.LEFT + ":</td><td>" + historyRouteData.stops[n].dt_end + "</td></tr>";
                    var r = historyRouteData.stops[n].fuel_consumption;
                    0 != r && (l += "<tr><td>" + la.FUEL_CONSUMPTION + ":</td><td>" + r + " " + la.UNIT_CAPACITY + "</td></tr>");
                    var d = historyRouteData.stops[n].fuel_cost;
                    0 != d && (l += "<tr><td>" + la.FUEL_COST + ":</td><td>" + d + " " + settingsUserData.currency + "</td></tr>"), 0 != getSensorFromType(a, "acc") && (l += "<tr><td>" + la.ENGINE_IDLE + ":</td><td>" + historyRouteData.stops[n].engine_idle + "</td></tr>"), l += "</table>"
                }
                "point" != s && "drive" != s && "stop" != s || $("#side_panel_history_route_detail_list_grid #" + i).qtip({
                    content: l,
                    position: {
                        my: "left bottom",
                        adjust: {
                            x: 0,
                            y: -9
                        }
                    }
                })
            }
        },
        onSelectRow: function(e) {
            var t = $(this).jqGrid("getCell", e, "el_type"),
                a = $(this).jqGrid("getCell", e, "el_id");
            "point" == t ? (0 == historyRouteData.play.status && historyRoutePanToPoint(a), historyRouteShowPoint(a)) : "stop" == t ? (0 == historyRouteData.play.status && historyRoutePanToStop(a), historyRouteShowStop(a)) : "event" == t ? (0 == historyRouteData.play.status && historyRoutePanToEvent(a), historyRouteShowEvent(a)) : "drive" == t && (0 == historyRouteData.play.status && historyRouteRemovePointMarker(), destroyMapPopup(), historyRouteShowDrive(a))
        }
    }), $("#side_panel_history_route_data_list_grid").jqGrid({
        datatype: "local",
        colNames: [la.DATA, la.VALUE],
        colModel: [{
            name: "data",
            index: "data",
            width: 110,
            sortable: !1
        }, {
            name: "value",
            index: "value",
            width: 203,
            sortable: !1
        }],
        width: "340",
        height: "155",
        rowNum: 512,
        shrinkToFit: !1
    }), $("#bottom_panel_msg_list_grid").jqGrid({
        url: "func/fn_history.php?cmd=load_msg_list_empty",
        datatype: "json",
        colNames: [la.TIME_POSITION, la.TIME_SERVER, la.LATITUDE, la.LONGITUDE, la.ALTITUDE, la.ANGLE, la.SPEED, la.PARAMETERS],
        colModel: [{
            name: "dt_tracker",
            index: "dt_tracker",
            width: 120,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "dt_server",
            index: "dt_server",
            width: 120,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "lat",
            index: "lat",
            width: 100,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "lng",
            index: "lng",
            width: 100,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "altitude",
            index: "altitude",
            width: 90,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "angle",
            index: "angle",
            width: 80,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "speed",
            index: "speed",
            width: 80,
            fixed: !0,
            align: "center",
            sortable: !0
        }, {
            name: "params",
            index: "params",
            align: "left",
            sortable: !0
        }],
        sortname: "dt_tracker",
        sortorder: "desc",
        rowNum: 50,
        rowList: [25, 50, 100, 200, 300, 400, 500],
        pager: "#bottom_panel_msg_list_grid_pager",
        height: "111",
        beforeSelectRow: function(e, t) {
            if ("input" === t.target.tagName.toLowerCase()) return !0;
            var a = $(this).jqGrid("getCell", e, "lat"),
                o = $(this).jqGrid("getCell", e, "lng");
            return 0 != a && 0 != o && utilsPointOnMap(a, o), !1
        },
        shrinkToFit: !0,
        multiselect: !0
    }), $("#bottom_panel_msg_list_grid").jqGrid("navGrid", "#bottom_panel_msg_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#bottom_panel_msg_list_grid").navButtonAdd("#bottom_panel_msg_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "bottom_panel_msg_list_grid_action_menu_button"
    }), $("#bottom_panel_msg_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#bottom_panel_msg_list_grid_action_menu").hide(), $("#bottom_panel_msg_list_grid_action_menu_button").click(function() {
        return $("#bottom_panel_msg_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#bottom_panel_msg_list_grid_action_menu").hide()
        }), !1
    }), $(window).bind("resize", function() {
        "none" == document.getElementById("side_panel").style.display ? $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 23) : $("#bottom_panel_msg_list_grid").setGridWidth($(window).width() - 384)
    }).trigger("resize"), $("#cmd_schedule_list_grid").jqGrid({
        url: "func/fn_cmd.php?cmd=load_cmd_schedule_list",
        datatype: "json",
        colNames: [la.NAME, la.ACTIVE, la.SCHEDULE, la.GATEWAY, la.TYPE, la.COMMAND, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 150,
            sortable: !0
        }, {
            name: "active",
            index: "active",
            width: 60,
            align: "center",
            sortable: !0
        }, {
            name: "exact_time",
            index: "exact_time",
            width: 90,
            align: "center",
            sortable: !0
        }, {
            name: "gateway",
            index: "gateway",
            width: 60,
            align: "center",
            sortable: !0
        }, {
            name: "type",
            index: "type",
            width: 60,
            align: "center",
            sortable: !0
        }, {
            name: "cmd",
            index: "cmd",
            width: 308,
            sortable: !0
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        sortname: "name",
        sortorder: "asc",
        rowNum: 50,
        rowList: [25, 50, 100, 200],
        pager: "#cmd_schedule_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "450px",
        width: "850",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#cmd_schedule_list_grid").jqGrid("navGrid", "#cmd_schedule_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            cmdScheduleProperties("add")
        }
    }), $("#cmd_schedule_list_grid").navButtonAdd("#cmd_schedule_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "cmd_schedule_list_grid_action_menu_button"
    }), $("#cmd_schedule_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#cmd_schedule_list_grid_action_menu").hide(), $("#cmd_schedule_list_grid_action_menu_button").click(function() {
        return $("#cmd_schedule_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#cmd_schedule_list_grid_action_menu").hide()
        }), !1
    }), $("#cmd_template_list_grid").jqGrid({
        url: "func/fn_cmd.php?cmd=load_cmd_template_list",
        datatype: "json",
        colNames: [la.NAME, la.PROTOCOL, la.GATEWAY, la.TYPE, la.COMMAND, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 150,
            sortable: !0
        }, {
            name: "protocol",
            index: "protocol",
            width: 150,
            align: "center",
            sortable: !0
        }, {
            name: "gateway",
            index: "gateway",
            width: 60,
            align: "center",
            sortable: !0
        }, {
            name: "type",
            index: "type",
            width: 60,
            align: "center",
            sortable: !0
        }, {
            name: "cmd",
            index: "cmd",
            width: 313,
            sortable: !0
        }, {
            name: "modify",
            index: "modify",
            width: 45,
            align: "center",
            sortable: !1
        }],
        sortname: "name",
        sortorder: "asc",
        rowNum: 50,
        rowList: [25, 50, 100, 200],
        pager: "#cmd_template_list_grid_pager",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "450px",
        width: "850",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#cmd_template_list_grid").jqGrid("navGrid", "#cmd_template_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            cmdTemplateProperties("add")
        }
    }), $("#cmd_template_list_grid").navButtonAdd("#cmd_template_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "cmd_template_list_grid_action_menu_button"
    }), $("#cmd_template_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#cmd_template_list_grid_action_menu").hide(), $("#cmd_template_list_grid_action_menu_button").click(function() {
        return $("#cmd_template_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#cmd_template_list_grid_action_menu").hide()
        }), !1
    }), $("#cmd_status_list_grid").jqGrid({
        url: "func/fn_cmd.php?cmd=load_cmd_exec_list",
        datatype: "json",
        colNames: [la.TIME, la.OBJECT, la.NAME, la.GATEWAY, la.TYPE, la.COMMAND, la.STATUS, "", ""],
        colModel: [{
            name: "dt_cmd",
            index: "dt_cmd",
            width: 110,
            sortable: !0
        }, {
            name: "object",
            index: "object",
            width: 111,
            sortable: !1
        }, {
            name: "name",
            index: "name",
            width: 100,
            sortable: !1
        }, {
            name: "gateway",
            index: "gateway",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "type",
            index: "type",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "cmd",
            index: "cmd",
            width: 222,
            sortable: !1
        }, {
            name: "status",
            index: "status",
            width: 50,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }, {
            name: "re_hex",
            index: "re_hex",
            hidden: !0
        }],
        rowNum: 12288,
        pager: "#cmd_status_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "dt_cmd",
        sortorder: "desc",
        viewrecords: !0,
        height: "359px",
        width: "850",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        },
        subGrid: !0,
        subGridRowExpanded: function(e, t) {
            var a = $("#cmd_status_list_grid").getRowData(t).re_hex,
                o = hexToAscii(a),
                i = "";
            "" == o && "" == a ? i = la.NO_DATA : (i = '<table style="table-layout: fixed; width: 100%">', i += '<tr><td style="width: 40px;">ASCII:</td><td style="word-wrap: break-word;">' + o + "</td></tr>", i += '<tr><td>HEX:</td><td style="word-wrap:break-word;">' + a + "</td></tr>", i += "</table>"), $("#" + e).html(i)
        }
    }), $("#cmd_status_list_grid").jqGrid("navGrid", "#cmd_status_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#cmd_status_list_grid").navButtonAdd("#cmd_status_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "cmd_status_list_grid_action_menu_button"
    }), $("#cmd_status_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#cmd_status_list_grid_action_menu").hide(), $("#cmd_status_list_grid_action_menu_button").click(function() {
        return $("#cmd_status_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#cmd_status_list_grid_action_menu").hide()
        }), !1
    }), $("#report_list_grid").jqGrid({
        url: "func/fn_reports.php?cmd=load_report_list",
        datatype: "json",
        colNames: [la.NAME, la.TYPE, la.FORMAT, la.OBJECTS, la.ZONES, la.SENSORS, la.DAILY, la.WEEKLY, ""],
        colModel: [{
            name: "name",
            index: "name",
            width: 240,
            sortable: !0
        }, {
            name: "type",
            index: "type",
            width: 215,
            align: "center",
            sortable: !1
        }, {
            name: "format",
            index: "format",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "objects",
            index: "objects",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "zones",
            index: "zones",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "sensors",
            index: "sensors",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "daily",
            index: "daily",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "weekly",
            index: "weekly",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 60,
            align: "center",
            sortable: !1
        }],
        rowNum: 12288,
        pager: "#report_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "450px",
        width: "962",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        },
        loadComplete: function(e) {
            for (var t = $(this).getDataIDs(), a = 0; a < t.length; a++) {
                var o = t[a];
                $("#report_action_menu_" + o).click(function() {
                    return $("#report_action_menu").toggle().position({
                        my: "left top",
                        at: "right bottom",
                        of: this
                    }), menuOnItem = $(this).attr("tag"), $(document).one("click", function() {
                        $("#report_action_menu").hide()
                    }), !1
                })
            }
        }
    }), $("#report_list_grid").jqGrid("navGrid", "#report_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            reportProperties("add")
        }
    }), $("#report_list_grid").navButtonAdd("#report_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "report_list_grid_action_menu_button"
    }), $("#report_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#report_list_grid_action_menu").hide(), $("#report_list_grid_action_menu_button").click(function() {
        return $("#report_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#report_list_grid_action_menu").hide()
        }), !1
    }), $("#reports_generated_list_grid").jqGrid({
        url: "func/fn_reports.php?cmd=load_reports_generated_list",
        datatype: "json",
        colNames: [la.TIME, la.NAME, la.TYPE, la.FORMAT, la.OBJECTS, la.ZONES, la.SENSORS, la.SCHEDULE, ""],
        colModel: [{
            name: "dt_report",
            index: "dt_report",
            width: 110,
            fixed: !0,
            align: "center"
        }, {
            name: "name",
            index: "name",
            width: 215,
            sortable: !0
        }, {
            name: "type",
            index: "type",
            width: 190,
            align: "center",
            sortable: !1
        }, {
            name: "format",
            index: "format",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "objects",
            index: "objects",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "zones",
            index: "zones",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "sensors",
            index: "sensors",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "schedule",
            index: "schedule",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 60,
            align: "center",
            sortable: !1
        }],
        sortname: "dt_report",
        sortorder: "desc",
        rowNum: 50,
        rowList: [50, 100, 200, 300, 400, 500],
        pager: "#reports_generated_list_grid_pager",
        viewrecords: !0,
        height: "450px",
        width: "962",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#reports_generated_list_grid").jqGrid("navGrid", "#reports_generated_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#reports_generated_list_grid").navButtonAdd("#reports_generated_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "reports_generated_list_grid_action_menu_button"
    }), $("#reports_generated_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#reports_generated_list_grid_action_menu").hide(), $("#reports_generated_list_grid_action_menu_button").click(function() {
        return $("#reports_generated_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#reports_generated_list_grid_action_menu").hide()
        }), !1
    }), $("#rilogbook_logbook_grid").jqGrid({
        url: "",
        datatype: "json",
        colNames: [la.TIME, la.OBJECT, la.GROUP, la.NAME, la.POSITION, ""],
        colModel: [{
            name: "dt_tracker",
            index: "dt_tracker",
            width: 60,
            sortable: !0
        }, {
            name: "imei",
            index: "imei",
            width: 80,
            align: "left",
            sortable: !1
        }, {
            name: "group",
            index: "group",
            width: 60,
            align: "center",
            sortable: !1
        }, {
            name: "name",
            index: "name",
            width: 80,
            align: "left",
            sortable: !1
        }, {
            name: "position",
            index: "position",
            width: 175,
            align: "left",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }],
        sortname: "dt_tracker",
        sortorder: "desc",
        rowNum: 50,
        rowList: [50, 100, 200, 300, 400, 500],
        pager: "#rilogbook_logbook_grid_pager",
        viewrecords: !0,
        height: "150px",
        width: "750",
        shrinkToFit: !0,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#rilogbook_logbook_grid").jqGrid("navGrid", "#rilogbook_logbook_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#rilogbook_logbook_grid").navButtonAdd("#rilogbook_logbook_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "rilogbook_logbook_grid_action_menu_button"
    }), $("#rilogbook_logbook_grid_action_menu").menu({
        role: "listbox"
    }), $("#rilogbook_logbook_grid_action_menu").hide(), $("#rilogbook_logbook_grid_action_menu_button").click(function() {
        return $("#rilogbook_logbook_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#rilogbook_logbook_grid_action_menu").hide()
        }), !1
    }), $("#dtc_list_grid").jqGrid({
        url: "",
        datatype: "json",
        colNames: [la.TIME, la.OBJECT, la.CODE, la.POSITION, ""],
        colModel: [{
            name: "dt_tracker",
            index: "dt_tracker",
            width: 60,
            sortable: !0
        }, {
            name: "imei",
            index: "imei",
            width: 80,
            align: "left",
            sortable: !1
        }, {
            name: "code",
            index: "code",
            width: 60,
            align: "left",
            sortable: !1
        }, {
            name: "position",
            index: "position",
            width: 215,
            align: "left",
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }],
        sortname: "dt_tracker",
        sortorder: "desc",
        rowNum: 50,
        rowList: [50, 100, 200, 300, 400, 500],
        pager: "#dtc_list_grid_pager",
        viewrecords: !0,
        height: "150px",
        width: "750",
        shrinkToFit: !0,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            return "input" === t.target.tagName.toLowerCase()
        }
    }), $("#dtc_list_grid").jqGrid("navGrid", "#dtc_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#dtc_list_grid").navButtonAdd("#dtc_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "dtc_list_grid_action_menu_button"
    }), $("#dtc_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#dtc_list_grid_action_menu").hide(), $("#dtc_list_grid_action_menu_button").click(function() {
        return $("#dtc_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#dtc_list_grid_action_menu").hide()
        }), !1
    }), $("#image_gallery_list_grid").jqGrid({
        url: "func/fn_img.php?cmd=load_img_list",
        datatype: "json",
        colNames: [la.TIME, la.OBJECT, "", "", "", "", ""],
        colModel: [{
            name: "dt_tracker",
            index: "dt_tracker",
            width: 110,
            sortable: !0
        }, {
            name: "object",
            index: "object",
            width: 111,
            sortable: !1
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }, {
            name: "img_file",
            index: "img_file",
            hidden: !0
        }, {
            name: "lat",
            index: "lat",
            hidden: !0
        }, {
            name: "lng",
            index: "lng",
            hidden: !0
        }, {
            name: "speed",
            index: "speed",
            hidden: !0
        }],
        rowNum: 25,
        recordtext: "",
        emptyrecords: "",
        rowList: [25, 50, 75, 100],
        pager: "#image_gallery_list_grid_pager",
        sortname: "dt_server",
        sortorder: "desc",
        viewrecords: !0,
        height: "302px",
        width: "308",
        shrinkToFit: !1,
        multiselect: !0,
        beforeSelectRow: function(e, t) {
            if ("input" === t.target.tagName.toLowerCase()) return !0;
            var a = "data/img/" + $(this).jqGrid("getCell", e, "img_file"),
                o = $(this).jqGrid("getCell", e, "lat"),
                i = $(this).jqGrid("getCell", e, "lng");
            $(this).jqGrid("getCell", e, "speed");
            fileExist(a) ? document.getElementById("image_gallery_img").innerHTML = '<img style="image-orientation: from-image; height: 480px;" src="' + a + '">' : document.getElementById("image_gallery_img").innerHTML = '<img src="img/no-image.svg">';
            var s = '<span id="image_gallery_img_data_address"></span>',
                n = '<table border="0" cellspacing="0" height="100%"><tr><td style="white-space:nowrap;">' + urlPosition(o, i) + s + "</td></tr></table>";
            return document.getElementById("image_gallery_img_data").innerHTML = n, geocoderGetAddress(o, i, function(e) {
                "" != e && (document.getElementById("image_gallery_img_data_address").innerHTML = " - " + e)
            }), !1
        }
    }), $("#image_gallery_list_grid").jqGrid("navGrid", "#image_gallery_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1
    }), $("#image_gallery_list_grid").navButtonAdd("#image_gallery_list_grid_pager", {
        caption: "",
        title: la.ACTION,
        buttonicon: "ui-icon-action",
        onClickButton: function() {},
        position: "last",
        id: "image_gallery_list_grid_action_menu_button"
    }), $("#image_gallery_list_grid_action_menu").menu({
        role: "listbox"
    }), $("#image_gallery_list_grid_action_menu").hide(), $("#image_gallery_list_grid_action_menu_button").click(function() {
        return $("#image_gallery_list_grid_action_menu").toggle().position({
            my: "left bottom",
            at: "right-5 top-5",
            of: this
        }), $(document).one("click", function() {
            $("#image_gallery_list_grid_action_menu").hide()
        }), !1
    }), $("#chat_object_list_grid").jqGrid({
        datatype: "local",
        colNames: ["", "", la.OBJECT],
        colModel: [{
            name: "search",
            index: "search",
            hidden: !0
        }, {
            name: "icon",
            index: "icon",
            width: 28,
            sortable: !1
        }, {
            name: "name",
            index: "search",
            width: 170
        }],
        rowNum: 4096,
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        width: "225",
        shrinkToFit: !1,
        loadComplete: function(e) {
            chatUpdateMsgCount(), chatUpdateMsgDt()
        },
        onSelectRow: function(e) {
            chatSelectObject(e)
        }
    }), $("#chat_object_list_search").bind("keyup", function(e) {
        var t = $("#chat_object_list_grid"),
            a = t.jqGrid("getGridParam", "postData");
        jQuery.extend(a, {
            filters: "",
            searchField: "search",
            searchOper: "cn",
            searchString: this.value.toLowerCase()
        }), t.jqGrid("setGridParam", {
            search: !0,
            postData: a
        }), t.trigger("reloadGrid")
    }), $("#billing_plan_list_grid").jqGrid({
        url: "func/fn_billing.php?cmd=load_billing_plan_list",
        datatype: "json",
        colNames: [la.TIME, la.NAME, la.OBJECTS, la.PERIOD, la.PRICE, ""],
        colModel: [{
            name: "dt_purchase",
            index: "dt_purchase",
            width: 110,
            fixed: !0,
            align: "center"
        }, {
            name: "name",
            index: "name",
            width: 248
        }, {
            name: "objects",
            index: "objects",
            width: 95,
            fixed: !0,
            align: "center"
        }, {
            name: "period",
            index: "period",
            width: 95,
            fixed: !0,
            align: "center"
        }, {
            name: "price",
            index: "price",
            width: 95,
            fixed: !0,
            align: "center"
        }, {
            name: "modify",
            index: "modify",
            width: 30,
            align: "center",
            sortable: !1
        }],
        rowNum: 50,
        rowList: [25, 50, 75, 100, 200],
        pager: "#billing_plan_list_grid_pager",
        sortname: "dt_purchase",
        sortorder: "desc",
        viewrecords: !0,
        height: "388px",
        width: "720",
        shrinkToFit: !1
    }), $("#billing_plan_list_grid").jqGrid("navGrid", "#billing_plan_list_grid_pager", {
        add: !0,
        edit: !1,
        del: !1,
        search: !1,
        addfunc: function(e) {
            billingPlanPurchase()
        },
        addtitle: la.PURCHASE_PLAN
    }), $("#billing_plan_object_list_grid").jqGrid({
        datatype: "local",
        colNames: ["", la.NAME, la.IMEI, la.ACTIVE, la.EXPIRES_ON],
        colModel: [{
            name: "name_sort",
            index: "name_sort",
            hidden: !0
        }, {
            name: "name",
            index: "name_sort",
            width: 244
        }, {
            name: "imei",
            index: "imei",
            width: 160
        }, {
            name: "active",
            index: "active",
            width: 90,
            align: "center"
        }, {
            name: "object_expire_dt",
            index: "object_expire_dt",
            width: 110,
            align: "center"
        }],
        rowNum: 4096,
        pager: "#billing_plan_object_list_grid_pager",
        pgbuttons: !1,
        pgtext: "",
        recordtext: "",
        emptyrecords: "",
        sortname: "name",
        sortorder: "asc",
        viewrecords: !0,
        height: "270",
        width: "665",
        shrinkToFit: !1,
        multiselect: !0,
        onSelectRow: function(e) {
            billingPlanUseUpdateSelection()
        },
        onSelectAll: function(e) {
            billingPlanUseUpdateSelection()
        }
    }), $("#billing_plan_object_list_grid").jqGrid("navGrid", "#billing_plan_object_list_grid_pager", {
        add: !1,
        edit: !1,
        del: !1,
        search: !1,
        refresh: !1
    }), $(".ui-jqgrid-titlebar-close").hide(), $(".ui-pg-selbox").multipleSelect({
        single: !0,
        width: "50px"
    }), $(window).bind("resize", function() {
        resizeGrids()
    }).trigger("resize")
}

function gridElementTypeToggle(e, t, a) {
    var o = (e = $(e)).getRowData().length;
    for (i = 0; i < o; i++) e.jqGrid("getCell", i, "el_type") == t && $("#" + i, e).css({
        display: a
    })
}

function switchHistoryReportsDateFilter(e) {
    if ("history" == e) t = "side_panel_history_";
    else if ("report" == e) t = "dialog_report_";
    else if ("img" == e) t = "dialog_image_gallery_";
    else if ("rilogbook" == e) t = "dialog_rilogbook_";
    else if ("dtc" == e) var t = "dialog_dtc_";
    switch (document.getElementById(t + "hour_from").value = "00", document.getElementById(t + "hour_to").value = "00", document.getElementById(t + "minute_from").value = "00", document.getElementById(t + "minute_to").value = "00", document.getElementById(t + "filter").value) {
        case "0":
            document.getElementById(t + "date_from").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().format("YYYY-MM-DD");
            break;
        case "1":
            document.getElementById(t + "date_from").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "hour_from").value = moment().subtract("hour", 1).format("HH"), document.getElementById(t + "hour_to").value = moment().format("HH"), document.getElementById(t + "minute_from").value = moment().subtract("hour", 1).format("mm"), document.getElementById(t + "minute_to").value = moment().format("mm");
            break;
        case "2":
            document.getElementById(t + "date_from").value = moment().format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().add("days", 1).format("YYYY-MM-DD");
            break;
        case "3":
            document.getElementById(t + "date_from").value = moment().subtract("days", 1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().format("YYYY-MM-DD");
            break;
        case "4":
            document.getElementById(t + "date_from").value = moment().subtract("days", 2).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().subtract("days", 1).format("YYYY-MM-DD");
            break;
        case "5":
            document.getElementById(t + "date_from").value = moment().subtract("days", 3).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().subtract("days", 2).format("YYYY-MM-DD");
            break;
        case "6":
            document.getElementById(t + "date_from").value = moment().isoWeekday(1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().add("days", 1).format("YYYY-MM-DD");
            break;
        case "7":
            document.getElementById(t + "date_from").value = moment().isoWeekday(1).subtract("week", 1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().isoWeekday(1).format("YYYY-MM-DD");
            break;
        case "8":
            document.getElementById(t + "date_from").value = moment().startOf("month").format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().add("days", 1).format("YYYY-MM-DD");
            break;
        case "9":
            document.getElementById(t + "date_from").value = moment().startOf("month").subtract("month", 1).format("YYYY-MM-DD"), document.getElementById(t + "date_to").value = moment().startOf("month").format("YYYY-MM-DD")
    }
    $("#" + t + "hour_from").multipleSelect("refresh"), $("#" + t + "hour_to").multipleSelect("refresh"), $("#" + t + "minute_from").multipleSelect("refresh"), $("#" + t + "minute_to").multipleSelect("refresh")
}

function showExtraData(e, t, a) {
    var o = "",
        i = [];
    switch (e) {
        case "object":
            o = $("#side_panel_objects_object_data_list_grid");
            break;
        case "event":
            o = $("#side_panel_events_event_data_list_grid");
            break;
        case "route":
            o = $("#side_panel_history_route_data_list_grid")
    }
    if (o.clearGridData(!0), "" != a) {
        var s = a.dt_server,
            n = a.dt_tracker,
            l = a.lat,
            r = a.lng,
            d = a.altitude,
            _ = a.angle,
            c = (a.speed, a.params);
        switch (e) {
            case "object":
                -1 != (v = getObjectOdometer(t, !1)) && i.push({
                    data: la.ODOMETER,
                    value: v + " " + la.UNIT_DISTANCE
                }), -1 != (b = getObjectEngineHours(t, !1)) && i.push({
                    data: la.ENGINE_HOURS,
                    value: b
                });
                var g = objectsData[t].status_string;
                "" != g && i.push({
                    data: la.STATUS,
                    value: g
                }), i.push({
                    data: la.TIME_POSITION,
                    value: n
                }), i.push({
                    data: la.TIME_SERVER,
                    value: s
                });
                var m = objectsData[t].service;
                for (var u in m) "true" == m[u].data_list && i.push({
                    data: m[u].name,
                    value: m[u].status
                });
                var p = settingsObjectData[t].custom_fields;
                for (var u in p) {
                    var y = p[u];
                    "true" == y.data_list && i.push({
                        data: y.name,
                        value: y.value
                    })
                }
                break;
            case "event":
                -1 != (v = getObjectOdometer(t, a.params)) && i.push({
                    data: la.ODOMETER,
                    value: v + " " + la.UNIT_DISTANCE
                }), -1 != (b = getObjectEngineHours(t, a.params)) && i.push({
                    data: la.ENGINE_HOURS,
                    value: b
                }), i.push({
                    data: la.TIME_POSITION,
                    value: n
                }), i.push({
                    data: la.TIME_SERVER,
                    value: s
                });
                break;
            case "route":
                var v = getObjectOdometer(t, a.params); - 1 != v && i.push({
                    data: la.ODOMETER,
                    value: v + " " + la.UNIT_DISTANCE
                });
                var b = getObjectEngineHours(t, a.params); - 1 != b && i.push({
                    data: la.ENGINE_HOURS,
                    value: b
                })
        }
        var E = settingsObjectData[t].model;
        "" != E && i.push({
            data: la.MODEL,
            value: E
        });
        var h = settingsObjectData[t].vin;
        "" != h && i.push({
            data: la.VIN,
            value: h
        });
        var f = settingsObjectData[t].plate_number;
        "" != f && i.push({
            data: la.PLATE,
            value: f
        });
        var I = settingsObjectData[t].sim_number;
        "" != I && i.push({
            data: la.SIM_CARD_NUMBER,
            value: I
        });
        var D = getDriver(t, a.params);
        if (0 != D) {
            var B = '<a href="#" onclick="utilsShowDriverInfo(\'' + D.driver_id + "');\">" + D.name + "</a>";
            i.push({
                data: la.DRIVER,
                value: B
            })
        }
        var O = getTrailer(t, a.params);
        if (0 != O) {
            var j = '<a href="#" onclick="utilsShowTrailerInfo(\'' + O.trailer_id + "');\">" + O.name + "</a>";
            i.push({
                data: la.TRAILER,
                value: j
            })
        }
        if (1 == gsValues.side_panel_address) {
            geocoderGetAddress(l, r, function(e) {
                document.getElementById("side_panel_objects_object_data_list_grid_address").innerHTML = e, objectsData[t].address = e
            });
            var R = '<div id="side_panel_objects_object_data_list_grid_address">' + objectsData[t].address + "</div>";
            i.push({
                data: la.ADDRESS,
                value: R
            })
        }
        var T = urlPosition(l, r);
        i.push({
            data: la.POSITION,
            value: T
        }), i.push({
            data: la.ALTITUDE,
            value: d + " " + la.UNIT_HEIGHT
        }), i.push({
            data: la.ANGLE,
            value: _ + " &deg;"
        });
        var k = getNearestZone(t, l, r);
        "" != k.name && i.push({
            data: la.NEAREST_ZONE,
            value: k.name + " (" + k.distance + ")"
        });
        var S = getNearestMarker(t, l, r);
        "" != S.name && i.push({
            data: la.NEAREST_MARKER,
            value: S.name + " (" + S.distance + ")"
        });
        var w = settingsObjectData[t].sensors;
        for (var u in w) {
            var L = w[u];
            if ("true" == L.data_list) {
                var A = getSensorValue(c, L);
                i.push({
                    data: L.name,
                    value: A.value_full
                })
            }
        }
        for (var N = 0; N < i.length; N++) o.jqGrid("addRowData", N, i[N]);
        o.setGridParam({
            sortname: "data",
            sortorder: "asc"
        }).trigger("reloadGrid")
    }
}

function historyLoadGSR() {
    utilsCheckPrivileges("history") && (document.getElementById("load_file").addEventListener("change", historyLoadGSRFile, !1), document.getElementById("load_file").click())
}

function historyLoadGSRFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        loadingData(!0);
        try {
            var t = $.parseJSON(e.target.result);
            "0.2v" == t.gsr ? void 0 != settingsObjectData[t.imei] ? historyShowRoute(transformToHistoryRoute(t.route), t.imei, t.name) : notifyBox("error", la.ERROR, la.THERE_IS_NO_SUCH_OBJECT_IN_YOUR_ACCOUNT) : notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        loadingData(!1), document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", historyLoadGSRFile, !1)
}

function historyExportGSR() {
    if (utilsCheckPrivileges("history")) {
        var e = document.getElementById("side_panel_history_object_list").value,
            t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
            a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
            o = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00",
            i = document.getElementById("side_panel_history_stop_duration").value;
        if ("" != e) {
            var s = "func/fn_export.php?format=gsr&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + o + "&min_stop_duration=" + i;
            window.location = s
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    }
}

function historyExportKML() {
    if (utilsCheckPrivileges("history")) {
        var e = document.getElementById("side_panel_history_object_list").value,
            t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
            a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
            o = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00";
        if ("" != e) {
            var i = "func/fn_export.php?format=kml&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + o;
            window.location = i
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    }
}

function historyExportGPX() {
    if (utilsCheckPrivileges("history")) {
        var e = document.getElementById("side_panel_history_object_list").value,
            t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
            a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
            o = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00";
        if ("" != e) {
            var i = "func/fn_export.php?format=gpx&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + o;
            window.location = i
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    }
}

function historyExportCSV() {
    if (utilsCheckPrivileges("history")) {
        var e = document.getElementById("side_panel_history_object_list").value,
            t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
            a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
            o = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00";
        if ("" != e) {
            var i = "func/fn_export.php?format=history_csv&imei=" + e + "&name=" + t + "&dtf=" + a + "&dtt=" + o;
            window.location = i
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    }
}

function historySaveAsRoute() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("history") && 1 != gsValues.map_bussy) {
        var e = document.getElementById("side_panel_history_object_list").value,
            t = (document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text, document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00"),
            a = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00",
            o = document.getElementById("side_panel_history_stop_duration").value;
        if ("" != e) {
            loadingData(!0);
            var s = {
                cmd: "load_route_data",
                imei: e,
                dtf: t,
                dtt: a,
                min_stop_duration: o
            };
            $.ajax({
                type: "POST",
                url: "func/fn_history.php",
                data: s,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    var t = transformToHistoryRoute(e);
                    if ("" == t.route || t.route.length < 2) return notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), void loadingData(!1);
                    var a = Math.ceil(t.route.length / 200),
                        o = new Array;
                    for (i = 0; i < t.route.length; i += a) {
                        var s = t.route[i].lat,
                            n = t.route[i].lng;
                        o.push(L.latLng(s, n))
                    }
                    loadingData(!1), placesRouteSave(o)
                },
                error: function(e, t) {
                    notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), loadingData(!1)
                }
            })
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    }
}

function historyLoadRoute() {
    if (utilsCheckPrivileges("history")) {
        var e = document.getElementById("side_panel_history_object_list").value,
            t = document.getElementById("side_panel_history_object_list").options[document.getElementById("side_panel_history_object_list").selectedIndex].text,
            a = document.getElementById("side_panel_history_date_from").value + " " + document.getElementById("side_panel_history_hour_from").value + ":" + document.getElementById("side_panel_history_minute_from").value + ":00",
            o = document.getElementById("side_panel_history_date_to").value + " " + document.getElementById("side_panel_history_hour_to").value + ":" + document.getElementById("side_panel_history_minute_to").value + ":00",
            i = document.getElementById("side_panel_history_stop_duration").value;
        if ("" != e) {
            loadingData(!0);
            var s = {
                cmd: "load_route_data",
                imei: e,
                dtf: a,
                dtt: o,
                min_stop_duration: i
            };
            $.ajax({
                type: "POST",
                url: "func/fn_history.php",
                data: s,
                dataType: "json",
                cache: !1,
                success: function(i) {
                    historyShowRoute(transformToHistoryRoute(i), e, t), $("#bottom_panel_msg_list_grid").setGridParam({
                        url: "func/fn_history.php?cmd=load_msg_list&imei=" + e + "&dtf=" + a + "&dtt=" + o
                    }), $("#bottom_panel_msg_list_grid").trigger("reloadGrid")
                },
                error: function(e, t) {
                    notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), loadingData(!1)
                }
            })
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    }
}

function historyShowRoute(e, t, a) {
    if (historyHideRoute(), objectFollowAll(!1), "" == (historyRouteData = e).route || historyRouteData.route.length < 2) return notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST), loadingData(!1), void(historyRouteData = []);
    historyRouteData.name = a, historyRouteData.imei = t, historyRouteData.layers = new Array, historyRouteData.layers.route = !1, historyRouteData.layers.route_snap = !1, historyRouteData.layers.arrows = !1, historyRouteData.layers.arrows_snap = !1, historyRouteData.layers.stops = new Array, historyRouteData.layers.events = new Array, historyRouteData.layers.data_points = new Array, historyRouteData.play = new Array, historyRouteData.play.status = !1, historyRouteData.play.position = 0;
    var o = new Array;
    for (n = 0; n < historyRouteData.route.length; n++) {
        var i = historyRouteData.route[n].lat,
            s = historyRouteData.route[n].lng;
        o.push(L.latLng(i, s)), historyRouteAddDataPointMarkerToMap(n)
    }
    for (historyRouteData.layers.route = L.polyline(o, {
            color: settingsUserData.map_rc,
            opacity: .8,
            weight: 3
        }), mapLayers.history.addLayer(historyRouteData.layers.route), historyRouteData.layers.arrows = L.polylineDecorator(historyRouteData.layers.route, {
            patterns: [{
                offset: 25,
                repeat: 250,
                symbol: L.Symbol.arrowHead({
                    pixelSize: 14,
                    headAngle: 40,
                    pathOptions: {
                        fillOpacity: 1,
                        weight: 0
                    }
                })
            }]
        }), mapLayers.history.addLayer(historyRouteData.layers.arrows), historyRouteAddStartMarkerToMap(), historyRouteAddEndMarkerToMap(), n = 0; n < historyRouteData.stops.length; n++) historyRouteAddStopMarkerToMap(n);
    for (n = 0; n < historyRouteData.events.length; n++) historyRouteAddEventMarkerToMap(n);
    for ((e = []).push({
            el_type: "point",
            el_id: 0,
            icon: '<img src="img/markers/route-start.svg"/>',
            datetime: historyRouteData.route[0].dt_tracker,
            info: ""
        }), e.push({
            el_type: "point",
            el_id: historyRouteData.route.length - 1,
            icon: '<img src="img/markers/route-end.svg"/>',
            datetime: historyRouteData.route[historyRouteData.route.length - 1].dt_tracker,
            info: ""
        }), n = 0; n < historyRouteData.stops.length; n++) e.push({
        el_type: "stop",
        el_id: n,
        icon: '<img src="img/markers/route-stop.svg"/>',
        datetime: historyRouteData.stops[n].dt_start,
        info: historyRouteData.stops[n].duration
    });
    for (n = 0; n < historyRouteData.events.length; n++) e.push({
        el_type: "event",
        el_id: n,
        icon: '<img src="img/markers/route-event.svg"/>',
        datetime: historyRouteData.events[n].dt_tracker,
        info: historyRouteData.events[n].event_desc
    });
    for (n = 0; n < historyRouteData.drives.length; n++) e.push({
        el_type: "drive",
        el_id: n,
        icon: '<img src="img/markers/route-drive.svg"/>',
        datetime: historyRouteData.drives[n].dt_start,
        info: historyRouteData.drives[n].duration
    });
    for (var n = 0; n <= e.length; n++) $("#side_panel_history_route_detail_list_grid").jqGrid("addRowData", n, e[n]);
    $("#side_panel_history_route_detail_list_grid").setGridParam({
        sortname: "datetime",
        sortorder: "asc"
    }).trigger("reloadGrid"), historyRouteRoute(), historyRouteSnap(), historyRouteDataPoints(), historyRouteStops(), historyRouteEvents();
    var l = historyRouteData.layers.route.getBounds();
    map.fitBounds(l), showBottomPanel(), $("#bottom_panel_tabs").tabs("option", "active", 0), historyRouteCreateGraphSourceList(), historyRouteCreateGraph("speed"), document.getElementById("history_view_control").style.display = "block", loadingData(!1)
}

function historyHideRoute() {
    void 0 != historyRouteData.route && (document.getElementById("history_view_control").style.display = "none", hideBottomPanel(), document.getElementById("bottom_panel_graph_label").innerHTML = "", initGraph(), $("#bottom_panel_msg_list_grid").clearGridData(!0), $("#side_panel_history_route_detail_list_grid").clearGridData(!0), $("#side_panel_history_route_data_list_grid").clearGridData(!0), mapLayers.history.clearLayers(), historyRouteStop(), $(".qtip").each(function() {
        $(this).data("qtip").destroy()
    }), historyRouteData = [])
}

function historyRouteRouteToggle() {
    historyRouteToggle.route ? (historyRouteToggle.route = !1, document.getElementById("history_view_control_route").className = "icon-route-route enable") : (historyRouteToggle.route = !0, document.getElementById("history_view_control_route").className = "icon-route-route"), historyRouteRoute()
}

function historyRouteRoute() {
    void 0 != historyRouteData.layers && (mapLayers.history.removeLayer(historyRouteData.layers.route), 0 != historyRouteData.layers.route_snap && mapLayers.history.removeLayer(historyRouteData.layers.route_snap), historyRouteToggle.route && (0 != historyRouteData.layers.route_snap && historyRouteToggle.snap ? mapLayers.history.addLayer(historyRouteData.layers.route_snap) : mapLayers.history.addLayer(historyRouteData.layers.route)))
}

function historyRouteSnapToggle() {
    historyRouteToggle.snap ? (historyRouteToggle.snap = !1, document.getElementById("history_view_control_snap").className = "icon-route-snap enable") : (historyRouteToggle.snap = !0, document.getElementById("history_view_control_snap").className = "icon-route-snap"), historyRouteSnap()
}

function historyRouteSnap() {
    if (void 0 != historyRouteData.route)
        if (historyRouteToggle.snap)
            if (0 == historyRouteData.layers.route_snap && 0 == historyRouteData.layers.arrows_snap) {
                var e = new Array,
                    t = historyRouteData.route[0].lat,
                    a = historyRouteData.route[0].lng;
                e.push(L.latLng(t, a));
                var o = Math.floor(historyRouteData.route.length / 10);
                for (0 == o && (o = 1), i = 0; i < historyRouteData.route.length; i += o) t = historyRouteData.route[i].lat, a = historyRouteData.route[i].lng, e.push(L.latLng(t, a));
                t = historyRouteData.route[historyRouteData.route.length - 1].lat, a = historyRouteData.route[historyRouteData.route.length - 1].lng, e.push(L.latLng(t, a));
                var s = L.Routing.control({
                    waypoints: e,
                    show: !1,
                    showAlternatives: !1,
                    waypointMode: "snap",
                    createMarker: function() {}
                }).addTo(map);
                s.on("routeselected", function(t) {
                    e = t.route.coordinates, mapLayers.history.removeLayer(historyRouteData.layers.route), mapLayers.history.removeLayer(historyRouteData.layers.arrows), historyRouteData.layers.route_snap = L.polyline(e, {
                        color: settingsUserData.map_rc,
                        opacity: .8,
                        weight: 3
                    }), mapLayers.history.addLayer(historyRouteData.layers.route_snap), historyRouteData.layers.arrows_snap = L.polylineDecorator(historyRouteData.layers.route_snap, {
                        patterns: [{
                            offset: 25,
                            repeat: 250,
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 14,
                                headAngle: 40,
                                pathOptions: {
                                    fillOpacity: 1,
                                    weight: 0
                                }
                            })
                        }]
                    }), mapLayers.history.addLayer(historyRouteData.layers.arrows_snap), map.removeControl(s), historyRouteArrows()
                })
            } else historyRouteRoute(), historyRouteArrows();
    else historyRouteRoute(), historyRouteArrows()
}

function historyRouteArrowsToggle() {
    historyRouteToggle.arrows ? (historyRouteToggle.arrows = !1, document.getElementById("history_view_control_arrows").className = "icon-route-arrow enable") : (historyRouteToggle.arrows = !0, document.getElementById("history_view_control_arrows").className = "icon-route-arrow"), historyRouteArrows()
}

function historyRouteArrows() {
    void 0 != historyRouteData.layers && (mapLayers.history.removeLayer(historyRouteData.layers.arrows), 0 != historyRouteData.layers.arrows_snap && mapLayers.history.removeLayer(historyRouteData.layers.arrows_snap), historyRouteToggle.arrows && (0 != historyRouteData.layers.arrows_snap && historyRouteToggle.snap ? mapLayers.history.addLayer(historyRouteData.layers.arrows_snap) : mapLayers.history.addLayer(historyRouteData.layers.arrows)))
}

function historyRouteDataPointsToggle() {
    historyRouteToggle.data_points ? (historyRouteToggle.data_points = !1, document.getElementById("history_view_control_data_points").className = "icon-route-data-point enable") : (historyRouteToggle.data_points = !0, document.getElementById("history_view_control_data_points").className = "icon-route-data-point"), historyRouteDataPoints()
}

function historyRouteDataPoints() {
    if (void 0 != historyRouteData.layers)
        if (map.getZoom() >= 14)
            for (i = 0; i < historyRouteData.layers.data_points.length; i++) {
                e = historyRouteData.layers.data_points[i];
                historyRouteToggle.data_points ? 0 == mapLayers.history.hasLayer(e) && mapLayers.history.addLayer(e) : mapLayers.history.removeLayer(e)
            } else
                for (i = 0; i < historyRouteData.layers.data_points.length; i++) {
                    var e = historyRouteData.layers.data_points[i];
                    mapLayers.history.removeLayer(e)
                }
}

function historyRouteStopsToggle() {
    historyRouteToggle.stops ? (historyRouteToggle.stops = !1, document.getElementById("history_view_control_stops").className = "icon-route-stop enable") : (historyRouteToggle.stops = !0, document.getElementById("history_view_control_stops").className = "icon-route-stop"), historyRouteStops()
}

function historyRouteStops() {
    if (void 0 != historyRouteData.layers) {
        for (i = 0; i < historyRouteData.layers.stops.length; i++) {
            var e = historyRouteData.layers.stops[i];
            historyRouteToggle.stops ? mapLayers.history.addLayer(e) : mapLayers.history.removeLayer(e)
        }
        historyRouteToggle.stops ? gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "stop", "") : gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "stop", "none")
    }
}

function historyRouteEventsToggle() {
    historyRouteToggle.events ? (historyRouteToggle.events = !1, document.getElementById("history_view_control_events").className = "icon-route-event enable") : (historyRouteToggle.events = !0, document.getElementById("history_view_control_events").className = "icon-route-event"), historyRouteEvents()
}

function historyRouteEvents() {
    if (void 0 != historyRouteData.layers) {
        for (i = 0; i < historyRouteData.layers.events.length; i++) {
            var e = historyRouteData.layers.events[i];
            historyRouteToggle.events ? mapLayers.history.addLayer(e) : mapLayers.history.removeLayer(e)
        }
        historyRouteToggle.events ? gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "event", "") : gridElementTypeToggle("#side_panel_history_route_detail_list_grid", "event", "none")
    }
}

function historyRouteCreateGraphSourceList() {
    var e = historyRouteData.imei,
        t = document.getElementById("bottom_panel_graph_data_source");
    t.options.length = 0, t.options.add(new Option(la.SPEED, "speed")), t.options.add(new Option(la.ALTITUDE, "altitude"));
    var a = settingsObjectData[e].sensors;
    for (var o in a) {
        var i = a[o];
        "string" != i.result_type && "rel" != i.result_type && t.options.add(new Option(i.name, o))
    }
}

function historyRouteChangeGraphSource() {
    historyRouteCreateGraph(document.getElementById("bottom_panel_graph_data_source").value)
}

function historyRouteCreateGraph(e) {
    document.getElementById("bottom_panel_graph_label").innerHTML = "";
    var t = historyRouteData.imei;
    if (historyRouteData.graph = [], historyRouteData.graph.data = [], historyRouteData.graph.data_index = [], "speed" != e && "altitude" != e) var a = settingsObjectData[t].sensors[e];
    for (var o = 0; o < historyRouteData.route.length; o++) {
        var i = historyRouteData.route[o].dt_tracker,
            s = getTimestampFromDate(i.replace(/-/g, "/") + " UTC");
        if ("speed" == e) n = historyRouteData.route[o].speed;
        else if ("altitude" == e) n = historyRouteData.route[o].altitude;
        else {
            var n = getSensorValue(historyRouteData.route[o].params, a).value;
            "engh" == a.type && (n = n / 60 / 60, n = Math.round(100 * n) / 100)
        }
        historyRouteData.graph.data.push([s, n]), historyRouteData.graph.data_index[s] = o
    }
    "speed" == e ? (historyRouteData.graph.units = la.UNIT_SPEED, historyRouteData.graph.result_type = "") : "altitude" == e ? (historyRouteData.graph.units = la.UNIT_HEIGHT, historyRouteData.graph.result_type = "") : "odo" == a.type ? (historyRouteData.graph.units = la.UNIT_DISTANCE, historyRouteData.graph.result_type = a.result_type) : "engh" == a.type ? (historyRouteData.graph.units = la.UNIT_H, historyRouteData.graph.result_type = a.result_type) : (historyRouteData.graph.units = a.units, historyRouteData.graph.result_type = a.result_type), initGraph(historyRouteData.graph)
}

function historyRoutePlay() {
    if (clearTimeout(timer_historyRoutePlay), 0 == historyRouteData.play.status && destroyMapPopup(), historyRouteData.route.length > 0 && historyRouteData.play.position < historyRouteData.route.length) {
        var e = historyRouteData.route[historyRouteData.play.position].dt_tracker;
        graphSetCrosshair(getTimestampFromDate(e.replace(/-/g, "/") + " UTC"));
        var t = historyRouteData.graph.data,
            a = historyRouteData.graph.units;
        document.getElementById("bottom_panel_graph_label").innerHTML = t[historyRouteData.play.position][1] + " " + a + " - " + e;
        var o = historyRouteData.route[historyRouteData.play.position];
        if (showExtraData("route", historyRouteData.imei, o), historyRoutePanToPoint(historyRouteData.play.position), historyRouteAddPointMarkerToMap(historyRouteData.play.position), historyRouteData.play.status = !0, historyRouteData.play.position == historyRouteData.route.length - 1) return clearTimeout(timer_historyRoutePlay), historyRouteData.play.status = !1, void(historyRouteData.play.position = 0);
        1 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 2e3) : 2 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 1e3) : 3 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 500) : 4 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 250) : 5 == document.getElementById("bottom_panel_graph_play_speed").value ? timer_historyRoutePlay = setTimeout("historyRoutePlay()", 125) : 6 == document.getElementById("bottom_panel_graph_play_speed").value && (timer_historyRoutePlay = setTimeout("historyRoutePlay()", 65)), historyRouteData.play.position++
    }
}

function historyRoutePause() {
    clearTimeout(timer_historyRoutePlay)
}

function historyRouteStop() {
    clearTimeout(timer_historyRoutePlay), historyRouteData.play.status = !1, historyRouteData.play.position = 0
}

function historyRouteAddStartMarkerToMap() {
    var e = historyRouteData.route[0].lng,
        t = historyRouteData.route[0].lat,
        a = L.marker([t, e], {
            icon: mapMarkerIcons.route_start
        });
    a.on("click", function(e) {
        historyRouteShowPoint(0)
    }), mapLayers.history.addLayer(a)
}

function historyRouteAddEndMarkerToMap() {
    var e = historyRouteData.route[historyRouteData.route.length - 1].lng,
        t = historyRouteData.route[historyRouteData.route.length - 1].lat,
        a = L.marker([t, e], {
            icon: mapMarkerIcons.route_end
        });
    a.on("click", function(e) {
        historyRouteShowPoint(historyRouteData.route.length - 1)
    }), mapLayers.history.addLayer(a)
}

function historyRouteAddStopMarkerToMap(e) {
    var t = historyRouteData.stops[e].lng,
        a = historyRouteData.stops[e].lat,
        o = L.marker([a, t], {
            icon: mapMarkerIcons.route_stop
        });
    o.on("click", function(t) {
        historyRouteShowStop(e)
    }), mapLayers.history.addLayer(o), historyRouteData.layers.stops.push(o)
}

function historyRouteAddEventMarkerToMap(e) {
    var t = historyRouteData.events[e].lng,
        a = historyRouteData.events[e].lat,
        o = L.marker([a, t], {
            icon: mapMarkerIcons.route_event
        });
    o.on("click", function(t) {
        historyRouteShowEvent(e)
    }), mapLayers.history.addLayer(o), historyRouteData.layers.events.push(o)
}

function historyRouteAddDataPointMarkerToMap(e) {
    historyRouteData.imei;
    var t = historyRouteData.route[e].lng,
        a = historyRouteData.route[e].lat,
        o = L.marker([a, t], {
            icon: mapMarkerIcons.route_data_point,
            iconAngle: 0
        }),
        i = e;
    o.on("click", function(e) {
        historyRouteShowPoint(i)
    }), historyRouteData.layers.data_points.push(o)
}

function historyRouteAddPointMarkerToMap(e) {
    historyRouteRemovePointMarker();
    var t = historyRouteData.imei,
        a = historyRouteData.route[e].lng,
        o = historyRouteData.route[e].lat,
        i = historyRouteData.route[e].angle,
        s = historyRouteData.route[e].speed,
        n = historyRouteData.route[e].dt_tracker,
        l = (historyRouteData.route[e].params, settingsUserData.map_is),
        r = i;
    "arrow" != settingsObjectData[t].map_icon && (r = 0);
    var d = getMarkerIcon(t, s, !1, !1),
        _ = L.marker([o, a], {
            icon: d,
            iconAngle: r
        }),
        c = s + " " + la.UNIT_SPEED + " - " + n;
    _.bindTooltip(c, {
        permanent: !0,
        offset: [20 * l, 0],
        direction: "right"
    }).openTooltip(), _.on("click", function(t) {
        historyRouteShowPoint(e)
    }), mapLayers.history.addLayer(_), historyRouteData.layers.point_marker = _
}

function historyRouteRemovePointMarker() {
    historyRouteData.layers.point_marker && mapLayers.history.removeLayer(historyRouteData.layers.point_marker)
}

function historyRoutePanToPoint(e) {
    var t = historyRouteData.route[e].lng,
        a = historyRouteData.route[e].lat;
    map.panTo({
        lat: a,
        lng: t
    })
}

function historyRouteShowPoint(e) {
    historyRouteRemoveDrive();
    var t = historyRouteData.name,
        a = historyRouteData.imei,
        o = historyRouteData.route[e].lng,
        i = historyRouteData.route[e].lat,
        s = historyRouteData.route[e].altitude,
        n = historyRouteData.route[e].angle,
        l = historyRouteData.route[e].speed,
        r = historyRouteData.route[e].dt_tracker,
        d = historyRouteData.route[e].params,
        _ = historyRouteData.route[e];
    showExtraData("route", a, _);
    var c = settingsUserData.map_is;
    geocoderGetAddress(i, o, function(_) {
        var g = _,
            m = urlPosition(i, o),
            u = "",
            p = new Array;
        for (var y in settingsObjectData[a].sensors) p.push(settingsObjectData[a].sensors[y]);
        var v = sortArrayByElement(p, "name");
        for (var y in v) {
            var b = v[y];
            if ("true" == b.popup) {
                var E = getSensorValue(d, b);
                u += "<tr><td><strong>" + b.name + ":</strong></td><td>" + E.value_full + "</td></tr>"
            }
        }
        var h = "<table>\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + g + "</td></tr>\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + m + "</td></tr>\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + s + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + n + " &deg;</td></tr>\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + l + " " + la.UNIT_SPEED + "</td></tr>\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + r + "</td></tr>",
            f = getObjectOdometer(a, d); - 1 != f && (h += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + f + " " + la.UNIT_DISTANCE + "</td></tr>");
        var I = getObjectEngineHours(a, d); - 1 != I && (h += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + I + "</td></tr>");
        var D = h + u;
        h += "</table>", D += "</table>", 0 == e || historyRouteData.route.length - 1 == e ? addPopupToMap(i, o, [0, -28 * c], h, D) : addPopupToMap(i, o, [0, -14 * c], h, D), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(i, o, n))
    })
}

function historyRoutePanToStop(e) {
    var t = historyRouteData.stops[e].lng,
        a = historyRouteData.stops[e].lat;
    map.panTo({
        lat: a,
        lng: t
    })
}

function historyRouteShowStop(e) {
    historyRouteRemoveDrive();
    var t = historyRouteData.name,
        a = historyRouteData.imei,
        o = historyRouteData.stops[e].lng,
        i = historyRouteData.stops[e].lat,
        s = historyRouteData.stops[e].altitude,
        n = historyRouteData.stops[e].angle,
        l = historyRouteData.stops[e].dt_start,
        r = historyRouteData.stops[e].dt_end,
        d = historyRouteData.stops[e].duration,
        _ = historyRouteData.stops[e].params,
        c = historyRouteData.stops[e];
    showExtraData("route", a, c);
    var g = settingsUserData.map_is;
    geocoderGetAddress(i, o, function(e) {
        var c = e,
            m = urlPosition(i, o),
            u = "",
            p = new Array;
        for (var y in settingsObjectData[a].sensors) p.push(settingsObjectData[a].sensors[y]);
        var v = sortArrayByElement(p, "name");
        for (var y in v) {
            var b = v[y];
            if ("true" == b.popup) {
                var E = getSensorValue(_, b);
                u += "<tr><td><strong>" + b.name + ":</strong></td><td>" + E.value_full + "</td></tr>"
            }
        }
        var h = "<table>\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + m + "</td></tr>\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + s + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + n + " &deg;</td></tr>\t\t\t<tr><td><strong>" + la.CAME + ":</strong></td><td>" + l + "</td></tr>\t\t\t<tr><td><strong>" + la.LEFT + ":</strong></td><td>" + r + "</td></tr>\t\t\t<tr><td><strong>" + la.DURATION + ":</strong></td><td>" + d + "</td></tr>",
            f = getObjectOdometer(a, _); - 1 != f && (h += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + f + " " + la.UNIT_DISTANCE + "</td></tr>");
        var I = getObjectEngineHours(a, _); - 1 != I && (h += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + I + "</td></tr>");
        var D = h + u;
        addPopupToMap(i, o, [0, -28 * g], h += "</table>", D += "</table>"), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(i, o, n))
    })
}

function historyRoutePanToEvent(e) {
    var t = historyRouteData.events[e].lng,
        a = historyRouteData.events[e].lat;
    map.panTo({
        lat: a,
        lng: t
    })
}

function historyRouteShowEvent(e) {
    historyRouteRemoveDrive();
    var t = historyRouteData.name,
        a = historyRouteData.imei,
        o = historyRouteData.events[e].event_desc,
        i = historyRouteData.events[e].dt_tracker,
        s = historyRouteData.events[e].lng,
        n = historyRouteData.events[e].lat,
        l = historyRouteData.events[e].altitude,
        r = historyRouteData.events[e].angle,
        d = historyRouteData.events[e].speed,
        _ = historyRouteData.events[e].params,
        c = historyRouteData.events[e];
    showExtraData("route", a, c);
    var g = settingsUserData.map_is;
    geocoderGetAddress(n, s, function(e) {
        var c = e,
            m = urlPosition(n, s),
            u = "",
            p = new Array;
        for (var y in settingsObjectData[a].sensors) p.push(settingsObjectData[a].sensors[y]);
        var v = sortArrayByElement(p, "name");
        for (var y in v) {
            var b = v[y];
            if ("true" == b.popup) {
                var E = getSensorValue(_, b);
                u += "<tr><td><strong>" + b.name + ":</strong></td><td>" + E.value_full + "</td></tr>"
            }
        }
        var h = "<table>\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t<tr><td><strong>" + la.EVENT + ":</strong></td><td>" + o + "</td></tr>\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + m + "</td></tr>\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + l + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + r + " &deg;</td></tr>\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + d + " " + la.UNIT_SPEED + "</td></tr>\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + i + "</td></tr>",
            f = getObjectOdometer(a, _); - 1 != f && (h += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + f + " " + la.UNIT_DISTANCE + "</td></tr>");
        var I = getObjectEngineHours(a, _); - 1 != I && (h += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + I + "</td></tr>");
        var D = h + u;
        addPopupToMap(n, s, [0, -28 * g], h += "</table>", D += "</table>"), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(n, s, r))
    })
}

function historyRouteRemoveDrive() {
    historyRouteData.layers.route_drive && mapLayers.history.removeLayer(historyRouteData.layers.route_drive)
}

function historyRouteShowDrive(e) {
    historyRouteRemoveDrive();
    var t = historyRouteData.drives[e].id_start_s,
        a = historyRouteData.drives[e].id_end,
        o = new Array;
    for (i = 0; i <= a - t; i++) {
        var s = historyRouteData.route[t + i].lat,
            n = historyRouteData.route[t + i].lng;
        o.push(L.latLng(s, n))
    }
    var l = L.polyline(o, {
        color: settingsUserData.map_rhc,
        opacity: .8,
        weight: 3
    });
    if (mapLayers.history.addLayer(l), 0 == historyRouteData.play.status) {
        var r = l.getBounds();
        map.fitBounds(r)
    }
    historyRouteData.layers.route_drive = l
}

function historyRouteMsgDeleteSelected() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_history_clear")) {
        var e = $("#bottom_panel_msg_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_msgs",
                    imei: historyRouteData.imei,
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_history.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && $("#bottom_panel_msg_list_grid").trigger("reloadGrid")
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function reportsOpen() {
    utilsCheckPrivileges("reports") && $("#dialog_reports").dialog("open")
}

function reportsReload() {
    reportsLoadData(), $("#report_list_grid").trigger("reloadGrid")
}

function reportsLoadData() {
    var e = {
        cmd: "load_report_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_reports.php",
        data: e,
        dataType: "json",
        cache: !1,
        success: function(e) {
            reportsData.reports = e
        }
    })
}

function reportProperties(e) {
    switch (e) {
        default:
            var t = e;
            // reportsData.reports[e].type;
            // console.log(reportsData.reports[e].type);
            if( reportsData.reports[e].type == 'overspeed3P'){
            reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,$("input[name='limite_velocidad']").prop('disabled',true),$("input[name='cantidad_r']").prop('disabled',false),$("input[name='filtro_a']").prop('disabled',false),$("input[name='filtro_d']").prop('disabled',false),$("input[name='filtro_u']").prop('disabled',false);

            }
            else { 
            reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,$("input[name='cantidad_r']").prop('disabled',true),$("input[name='filtro_a']").prop('disabled',true),$("input[name='filtro_d']").prop('disabled',true),$("input[name='filtro_u']").prop('disabled',true),$("input[name='limite_velocidad']").prop('disabled',false);
            }

            if( reportsData.reports[e].type == 'overspeedT'){
                reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,$("input[name='limite_velocidad']").prop('disabled',true),$("input[name='cantidad_r']").prop('disabled',false),$("input[name='filtro_a']").prop('disabled',false),$("input[name='filtro_d']").prop('disabled',false),$("input[name='filtro_u']").prop('disabled',false);
    
            }
            else { 
                reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,$("input[name='cantidad_r']").prop('disabled',true),$("input[name='filtro_a']").prop('disabled',true),$("input[name='filtro_d']").prop('disabled',true),$("input[name='filtro_u']").prop('disabled',true),$("input[name='limite_velocidad']").prop('disabled',false);
            }

            if( reportsData.reports[e].type == 'overSpeedGeoE'){
                reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,document.getElementById("menor_a").value = reportsData.reports[t].menor_a,document.getElementById("mayor_a").value = reportsData.reports[t].mayor_a,$("input[name='limite_velocidad']").prop('disabled',true),$("input[name='cantidad_r']").prop('disabled',false),$("input[name='filtro_a']").prop('disabled',false),$("input[name='filtro_d']").prop('disabled',false),$("input[name='filtro_u']").prop('disabled',false),$("input[name='mayor_a']").prop('disabled',false),$("input[name='menor_a']").prop('disabled',false);
    
                }
                else { 
                reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,document.getElementById("menor_a").value = 0,document.getElementById("mayor_a").value = 0,$("input[name='cantidad_r']").prop('disabled',true),$("input[name='filtro_a']").prop('disabled',true),$("input[name='filtro_d']").prop('disabled',true),$("input[name='filtro_u']").prop('disabled',true),$("input[name='limite_velocidad']").prop('disabled',false),$("input[name='mayor_a']").prop('disabled',true),$("input[name='menor_a']").prop('disabled',true);
                }
            if( reportsData.reports[e].type == 'overspeed3H'){
                reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,document.getElementById("cantidadhoras").value = reportsData.reports[t].cantidadhoras,document.getElementById("fechaenvio").value = reportsData.reports[t].fechaenvio,$("input[name='limite_velocidad']").prop('disabled',true),$("input[name='cantidad_r']").prop('disabled',false),$("input[name='filtro_a']").prop('disabled',false),$("input[name='filtro_d']").prop('disabled',false),$("input[name='filtro_u']").prop('disabled',false),$("input[name='cantidadhoras']").prop('disabled',false),$("input[name='fechaenvio']").prop('disabled',false);
    
                }
                else { 
                reportsData.edit_report_id = t, document.getElementById("dialog_report_name").value = reportsData.reports[t].name, document.getElementById("dialog_report_type").value = reportsData.reports[t].type, $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = reportsData.reports[t].format, $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = strToBoolean(reportsData.reports[t].show_coordinates), document.getElementById("dialog_report_show_addresses").checked = strToBoolean(reportsData.reports[t].show_addresses), document.getElementById("dialog_report_zones_addresses").checked = strToBoolean(reportsData.reports[t].zones_addresses), document.getElementById("dialog_report_stop_duration").value = reportsData.reports[t].stop_duration, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = reportsData.reports[t].speed_limit, document.getElementById("cantidad_r").value = reportsData.reports[t].cantidad_r,document.getElementById("filtro_u").value = reportsData.reports[t].filtro_u,document.getElementById("filtro_d").value = reportsData.reports[t].filtro_d,document.getElementById("filtro_a").value = reportsData.reports[t].filtro_a,document.getElementById("cantidadhoras").value = "",document.getElementById("fechaenvio").value = "",$("input[name='cantidad_r']").prop('disabled',true),$("input[name='filtro_a']").prop('disabled',true),$("input[name='filtro_d']").prop('disabled',true),$("input[name='filtro_u']").prop('disabled',true),$("input[name='limite_velocidad']").prop('disabled',false),$("input[name='cantidadhoras']").prop('disabled',true),$("input[name='fechaenvio']").prop('disabled',true);
                }
            var a = document.getElementById("dialog_report_object_list"),
                o = reportsData.reports[t].imei.split(",");
            multiselectSetValues(a, o), $("#dialog_report_object_list").multipleSelect("refresh");
            var i = document.getElementById("dialog_report_zone_list"),
                s = reportsData.reports[t].zone_ids.split(",");
            multiselectSetValues(i, s), $("#dialog_report_zone_list").multipleSelect("refresh"), reportsListSensors();
            var n = document.getElementById("dialog_report_sensor_list"),
                l = reportsData.reports[t].sensor_names.split(",");
            multiselectSetValues(n, l), $("#dialog_report_sensor_list").multipleSelect("refresh"), reportsListDataItems();
            var r = document.getElementById("dialog_report_data_item_list"),
                d = reportsData.reports[t].data_items.split(",");
            multiselectSetValues(r, d), $("#dialog_report_data_item_list").multipleSelect("refresh"), "d" == (B = reportsData.reports[t].schedule_period) ? (document.getElementById("dialog_report_schedule_period_daily").checked = !0, document.getElementById("dialog_report_schedule_period_weekly").checked = !1) : "w" == B ? (document.getElementById("dialog_report_schedule_period_daily").checked = !1, document.getElementById("dialog_report_schedule_period_weekly").checked = !0) : "dw" == B ? (document.getElementById("dialog_report_schedule_period_daily").checked = !0, document.getElementById("dialog_report_schedule_period_weekly").checked = !0) : (document.getElementById("dialog_report_schedule_period_daily").checked = !1, document.getElementById("dialog_report_schedule_period_weekly").checked = !1), document.getElementById("dialog_report_schedule_email_address").value = reportsData.reports[t].schedule_email_address, document.getElementById("dialog_report_filter").value = 2, $("#dialog_report_filter").multipleSelect("refresh"), switchHistoryReportsDateFilter("report"), $("#dialog_report_properties").dialog("open");
            break;
        case "add":
            reportsData.edit_report_id = !1, document.getElementById("dialog_report_name").value = "", document.getElementById("dialog_report_type").value = "general", $("#dialog_report_type").multipleSelect("refresh"), reportsSwitchType(), document.getElementById("dialog_report_format").value = "html", $("#dialog_report_format").multipleSelect("refresh"), document.getElementById("dialog_report_show_coordinates").checked = !0, document.getElementById("dialog_report_show_addresses").checked = !1, document.getElementById("dialog_report_zones_addresses").checked = !1, document.getElementById("dialog_report_stop_duration").value = 1, $("#dialog_report_stop_duration").multipleSelect("refresh"), document.getElementById("dialog_report_speed_limit").value = "", $("#dialog_report_object_list option:selected").removeAttr("selected"), $("#dialog_report_object_list").multipleSelect("refresh"), $("#dialog_report_zone_list option:selected").removeAttr("selected"), $("#dialog_report_zone_list").multipleSelect("refresh"), reportsListSensors(), $("#dialog_report_sensor_list option:selected").removeAttr("selected"), $("#dialog_report_sensor_list").multipleSelect("refresh"), reportsListDataItems(), $("#dialog_report_data_items_list option:selected").removeAttr("selected"), $("#dialog_report_data_items_list").multipleSelect("refresh"), document.getElementById("dialog_report_schedule_period_daily").checked = !1, document.getElementById("dialog_report_schedule_period_weekly").checked = !1, document.getElementById("dialog_report_schedule_email_address").value = "", document.getElementById("dialog_report_filter").value = 2, $("#dialog_report_filter").multipleSelect("refresh"), switchHistoryReportsDateFilter("report"), $("#dialog_report_properties").dialog("open"),document.getElementById("cantidad_r").value = "",document.getElementById("filtro_u").value = "",document.getElementById("filtro_d").value = "",document.getElementById("filtro_a").value = "",document.getElementById("menor_a").value = "" ,document.getElementById("mayor_a").value = "",document.getElementById("cantidadhoras").value = 0,document.getElementById("fechaenvio").value = 0,$("input[name='filtro_d']").prop('disabled',true),$("input[name='filtro_a']").prop('disabled',true),$("input[name='filtro_u']").prop('disabled',true),$("input[name='cantidad_r']").prop('disabled',true),$("input[name='limite_velocidad']").prop('disabled',false),$("input[name='mayor_a']").prop('disabled',false),$("input[name='menor_a']").prop('disabled',false),$("input[name='cantidadhoras']").prop('disabled',true),$("input[name='fechaenvio']").prop('disabled',true);
            break;
        case "cancel":
            $("#dialog_report_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var _ = document.getElementById("dialog_report_name").value,
                c = document.getElementById("dialog_report_type").value,
                g = document.getElementById("dialog_report_format").value,
                m = document.getElementById("dialog_report_show_coordinates").checked,
                u = document.getElementById("dialog_report_show_addresses").checked,
                p = document.getElementById("dialog_report_zones_addresses").checked,
                y = document.getElementById("dialog_report_stop_duration").value,
                v = document.getElementById("dialog_report_speed_limit").value,
                cantidad_r = document.getElementById("cantidad_r").value,
                filtro_u = document.getElementById("filtro_u").value,
                filtro_d = document.getElementById("filtro_d").value,
                filtro_a = document.getElementById("filtro_a").value,
                mayor_a = document.getElementById("mayor_a").value,
                menor_a = document.getElementById("menor_a").value,
                cantidadhoras = document.getElementById("cantidadhoras").value,
                fechaenvio = document.getElementById("fechaenvio").value,
                b = multiselectGetValues(document.getElementById("dialog_report_object_list")),
                E = multiselectGetValues(document.getElementById("dialog_report_zone_list")),
                h = multiselectGetValues(document.getElementById("dialog_report_sensor_list")),
                r = multiselectGetValues(document.getElementById("dialog_report_data_item_list"));
            if ("" == _) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
            if (("overspeed" == c || "underspeed" == c || "overspeedT" == c) && "" == v) return void notifyBox("error", la.ERROR, la.SPEED_LIMIT_CANT_BE_EMPTY);
            if ("" == b) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
            if ("zone_in_out" == c && "" == E) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ZONE_SELECTED);
            if (("logic_sensors" == c || "sensor_graph" == c) && "" == h) return void notifyBox("error", la.ERROR, la.AT_LEAST_ONE_SENSOR_SELECTED);
            var f = document.getElementById("dialog_report_schedule_period_daily").checked,
                I = document.getElementById("dialog_report_schedule_period_weekly").checked,
                D = document.getElementById("dialog_report_schedule_email_address").value,
                B = "";
            if (1 == f && (B = "d"), 1 == I && (B += "w"), "" != B)
                for (var O = D.split(","), j = 0; j < O.length; j++)
                    if (O[j] = O[j].trim(), !isEmailValid(O[j])) return void notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID);
            var R = {
                cmd: "save_report",
                report_id: reportsData.edit_report_id,
                name: _,
                type: c,
                format: g,
                show_coordinates: m,
                show_addresses: u,
                zones_addresses: p,
                stop_duration: y,
                speed_limit: v,
                cantidad_reportes: cantidad_r,
                filtro_uno: filtro_u,
                filtro_dos: filtro_d,
                filtro_tres: filtro_a,
                cantidad_horas: cantidadhoras,
                fecha_envio: fechaenvio,
                mayor_a: mayor_a,
                menor_a: menor_a,
                imei: b,
                zone_ids: E,
                sensor_names: h,
                data_items: r,
                schedule_period: B,
                schedule_email_address: D
            };

            // console.log(R);
            $.ajax({
                type: "POST",
                url: "func/fn_reports.php",
                data: R,
                cache: !1,
                success: function(e) {
                    "OK" == e && (reportsReload(), $("#dialog_report_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            });
            break;
        case "generate":
            var _ = document.getElementById("dialog_report_name").value,
                c = document.getElementById("dialog_report_type").value,
                g = document.getElementById("dialog_report_format").value,
                m = document.getElementById("dialog_report_show_coordinates").checked,
                u = document.getElementById("dialog_report_show_addresses").checked,
                p = document.getElementById("dialog_report_zones_addresses").checked,
                y = document.getElementById("dialog_report_stop_duration").value,
                v = document.getElementById("dialog_report_speed_limit").value,
                cantidad_r = document.getElementById("cantidad_r").value,
                filtro_u = document.getElementById("filtro_u").value,
                filtro_d = document.getElementById("filtro_d").value,
                filtro_a = document.getElementById("filtro_a").value,
                mayor_a = document.getElementById("mayor_a").value,
                menor_a = document.getElementById("menor_a").value,
                cantidad_horas = document.getElementById("cantidadhoras").value,
                fecha_envio = document.getElementById("fechaenvio").value,
                b = multiselectGetValues(document.getElementById("dialog_report_object_list")),
                E = multiselectGetValues(document.getElementById("dialog_report_zone_list")),
                h = multiselectGetValues(document.getElementById("dialog_report_sensor_list")),
                r = multiselectGetValues(document.getElementById("dialog_report_data_item_list")),
                T = $("#dialog_report_date_from").val() + " " + $("#dialog_report_hour_from").val() + ":" + $("#dialog_report_minute_from").val() + ":00",
                k = $("#dialog_report_date_to").val() + " " + $("#dialog_report_hour_to").val() + ":" + $("#dialog_report_minute_to").val() + ":00";
            "" == _ && (_ = document.getElementById("dialog_report_type").options[document.getElementById("dialog_report_type").selectedIndex].text), reportGenerate(R = {
                cmd: "report",
                name: _,
                type: c,
                format: g,
                show_coordinates: m,
                show_addresses: u,
                zones_addresses: p,
                stop_duration: y,
                speed_limit: v,
                cantidad_reportes: cantidad_r,
                filtro_uno: filtro_u,
                filtro_dos: filtro_d,
                filtro_tres: filtro_a,
                cantidad_horas: cantidad_horas,
                fecha_envio: fecha_envio,
                mayor_a: mayor_a,
                menor_a: menor_a,
                imei: b,
                zone_ids: E,
                sensor_names: h,
                data_items: r,
                dtf: T,
                dtt: k
            })
            
    }
}

function reportsDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_report",
                report_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_reports.php",
                data: a,
                success: function(e) {
                    "OK" == e && reportsReload()
                }
            })
        }
    })
}

function reportsDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#report_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_reports",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_reports.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && reportsReload()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function reportGenerate(e) {
    "overspeed" != e.type && "overspeedT" != e.type && "underspeed" != e.type && "rag" != e.type || "" != e.speed_limit ? "" != e.imei ? "zone_in_out" != e.type || "" != e.zone_ids ? "logic_sensors" != e.type && "sensor_graph" != e.type || "" != e.sensor_names ? (loadingData(!0), $.ajax({
        type: "POST",
        url: "func/fn_reports.gen.php",
        data: e,
        cache: !1,
        success: function(t) {
            loadingData(!1), $.generateFile({
                filename: e.type + "" + e.dtf + "" + e.dtt,
                content: t,
                script: "func/fn_saveas.php?format=" + e.format
            }), reportsGeneratedReload()
        },
        error: function(e, t) {
            loadingData(!1)
        }
    })) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_SENSOR_SELECTED) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ZONE_SELECTED) : notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED) : notifyBox("error", la.ERROR, la.SPEED_LIMIT_CANT_BE_EMPTY)
}

function reportsSelectObject() {
    reportsListSensors()
}

function reportsListDataItems() {
    var e = document.getElementById("dialog_report_type").value;
    if (void 0 != reportsData.data_items[e]) {
        var t = reportsData.data_items[e],
            a = document.getElementById("dialog_report_data_item_list");
        a.options.length = 0;
        for (var o = 0; o < t.length; o++) {
            var i = t[o].toUpperCase();
            i = la[i];
            var s = t[o];
            a.options.add(new Option(i, s))
        }
    }
    $("#dialog_report_data_item_list option").prop("selected", !0), $("#dialog_report_data_item_list").multipleSelect("refresh")
}

function reportsListSensors() {
    var e = document.getElementById("dialog_report_sensor_list");
    e.options.length = 0;
    var t = document.getElementById("dialog_report_type").value;
    if ("logic_sensors" == t || "sensor_graph" == t) {
        for (var a = document.getElementById("dialog_report_object_list"), o = new Array, i = 0; i < a.options.length; i++)
            if (a.options[i].selected) {
                var s = a.options[i].value,
                    n = settingsObjectData[s].sensors;
                for (var l in n) {
                    var r = n[l];
                    "string" != r.result_type && ("logic_sensors" == t ? "logic" == r.result_type && o.push(r.name) : "sensor_graph" == t && o.push(r.name))
                }
            } o = uniqueArray(o);
        for (i = 0; i < o.length; i++) e.options.add(new Option(o[i], o[i]));
        sortSelectList(e)
    }
    $("#dialog_report_sensor_list").multipleSelect("refresh")
}

function reportsSwitchType() {
    var e = document.getElementById("dialog_report_type").value,
        t = document.getElementById("dialog_report_format");
    switch (t.options.length = 0, "speed_graph" != e && "altitude_graph" != e && "acc_graph" != e && "fuellevel_graph" != e && "temperature_graph" != e && "sensor_graph" != e ? (t.options.add(new Option("HTML", "html")), t.options.add(new Option("PDF", "pdf")), t.options.add(new Option("XLS", "xls"))) : t.options.add(new Option("HTML", "html")), $("#dialog_report_format").multipleSelect("refresh"), e) {
        case "general":
        case "general_merged":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !1, document.getElementById("dialog_report_stop_duration").enable = !1, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "object_info":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "current_position":
        case "current_position_off":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "drives_stops":
        case "travel_sheet":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !1, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "mileage_daily":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !1, document.getElementById("dialog_report_stop_duration").enable = !1, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "overspeed":
        case "overspeedT":
        case "underspeed":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !1, document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "zone_in_out":
            document.getElementById("dialog_report_zone_list").enable = !1, document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "events":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "service":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "rag":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !1, document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "rilogbook":
        case "dtc":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "fuelfillings":
        case "fuelthefts":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "logic_sensors":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !1, document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !1, document.getElementById("dialog_report_show_addresses").enable = !1, document.getElementById("dialog_report_zones_addresses").enable = !1;
            break;
        case "speed_graph":
        case "altitude_graph":
        case "acc_graph":
        case "fuellevel_graph":
        case "temperature_graph":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !0, $("#dialog_report_sensor_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0;
            break;
        case "sensor_graph":
            document.getElementById("dialog_report_zone_list").enable = !0, $("#dialog_report_zone_list option:selected").removeAttr("selected"), document.getElementById("dialog_report_sensor_list").enable = !1, document.getElementById("dialog_report_speed_limit").enable = !0, document.getElementById("dialog_report_speed_limit").value = "", document.getElementById("dialog_report_stop_duration").enable = !0, document.getElementById("dialog_report_show_coordinates").enable = !0, document.getElementById("dialog_report_show_addresses").enable = !0, document.getElementById("dialog_report_zones_addresses").enable = !0
    }
    $("#dialog_report_zone_list").multipleSelect("refresh"), $("#dialog_report_sensor_list").multipleSelect("refresh")
}

function reportsGeneratedReload() {
    $("#reports_generated_list_grid").trigger("reloadGrid")
}

function reportsGeneratedOpen(e) {
    loadingData(!0);
    var t = {
        cmd: "open_generated",
        report_id: e
    };
    $.ajax({
        type: "POST",
        url: "func/fn_reports.php",
        data: t,
        dataType: "json",
        cache: !1,
        success: function(e) {
            loadingData(!1), $.generateFile({
                filename: e.filename,
                content: e.content,
                script: "func/fn_saveas.php?format=" + e.format
            })
        },
        error: function(e, t) {
            loadingData(!1)
        }
    })
}

function reportsGeneratedDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_report_generated",
                report_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_reports.php",
                data: a,
                success: function(e) {
                    "OK" == e && reportsGeneratedReload()
                }
            })
        }
    })
}

function reportsGeneratedDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#reports_generated_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_reports_generated",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_reports.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && reportsGeneratedReload()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function rilogbookOpen() {
    utilsCheckPrivileges("rilogbook") && ($("#dialog_rilogbook").bind("resize", function() {
        $("#rilogbook_logbook_grid").setGridHeight($("#dialog_rilogbook").height() - 133)
    }).trigger("resize"), $("#dialog_rilogbook").bind("resize", function() {
        $("#rilogbook_logbook_grid").setGridWidth($("#dialog_rilogbook").width())
    }).trigger("resize"), $("#dialog_rilogbook").dialog("open"))
}

function rilogbookClose() {
    $("#dialog_rilogbook").unbind("resize")
}

function rilogbookShow() {
    var e = "func/fn_rilogbook.php?cmd=load_rilogbook_list",
        t = document.getElementById("dialog_rilogbook_object_list").value,
        a = document.getElementById("dialog_rilogbook_drivers").checked,
        o = document.getElementById("dialog_rilogbook_passengers").checked,
        i = document.getElementById("dialog_rilogbook_trailers").checked,
        s = document.getElementById("dialog_rilogbook_date_from").value + " " + document.getElementById("dialog_rilogbook_hour_from").value + ":" + document.getElementById("dialog_rilogbook_minute_from").value + ":00",
        n = document.getElementById("dialog_rilogbook_date_to").value + " " + document.getElementById("dialog_rilogbook_hour_to").value + ":" + document.getElementById("dialog_rilogbook_minute_to").value + ":00";
    "" != t && (e += "&imei=" + t), e += "&drivers=" + a, e += "&passengers=" + o, e += "&trailers=" + i, s != n && (e += "&dtf=" + s + "&dtt=" + n), $("#rilogbook_logbook_grid").jqGrid("setGridParam", {
        url: e
    }).trigger("reloadGrid")
}

function rilogbookDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_record",
                rilogbook_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_rilogbook.php",
                data: a,
                success: function(e) {
                    "OK" == e && rilogbookShow()
                }
            })
        }
    })
}

function rilogbookDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#rilogbook_logbook_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_records",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_rilogbook.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && rilogbookShow()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function rilogbookDeleteAll() {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_LOGBOOK_RECORDS, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_records"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_rilogbook.php",
                data: t,
                success: function(e) {
                    "OK" == e && rilogbookShow()
                }
            })
        }
    })
}

function rilogbookExportCSV() {
    var e = "func/fn_export.php?format=rilogbook_csv",
        t = document.getElementById("dialog_rilogbook_object_list").value,
        a = document.getElementById("dialog_rilogbook_drivers").checked,
        o = document.getElementById("dialog_rilogbook_passengers").checked,
        i = document.getElementById("dialog_rilogbook_trailers").checked,
        s = document.getElementById("dialog_rilogbook_date_from").value + " " + document.getElementById("dialog_rilogbook_hour_from").value + ":" + document.getElementById("dialog_rilogbook_minute_from").value + ":00",
        n = document.getElementById("dialog_rilogbook_date_to").value + " " + document.getElementById("dialog_rilogbook_hour_to").value + ":" + document.getElementById("dialog_rilogbook_minute_to").value + ":00";
    "" != t && (e += "&imei=" + t), e += "&drivers=" + a, e += "&passengers=" + o, e += "&trailers=" + i, s != n && (e += "&dtf=" + s + "&dtt=" + n), window.location = e
}

function notifyCheck(e) {
    switch (e) {
        case "expiring_objects":
            if (1 == gsValues.notify_obj_expire)
                for (var t in settingsObjectData)
                    if ("true" == (a = settingsObjectData[t]).active && "true" == a.object_expire && getDateDifference(new Date(a.object_expire_dt), new Date) <= gsValues.notify_obj_expire_period) {
                        notifyBox("error", la.EXPIRING_OBJECTS, sprintf(la.SOME_OF_YOUR_OBJECTS_ACTIVATION_WILL_EXPIRE_SOON, "settingsOpen();"));
                        break
                    } break;
        case "inactive_objects":
            if (1 == gsValues.notify_obj_expire)
                for (var t in settingsObjectData) {
                    var a = settingsObjectData[t];
                    if ("false" == a.active) {
                        notifyBox("error", la.INACTIVE_OBJECTS, sprintf(la.THERE_ARE_INACTIVE_OBJECTS_IN_YOUR_ACCOUNT, "settingsOpen();"));
                        break
                    }
                }
            break;
        case "session_check":
            if (0 == gsValues.session_check) break;
            clearTimeout(timer_sessionCheck);
            var o = {
                cmd: "session_check"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_connect.php",
                data: o,
                cache: !1,
                error: function(e, t) {
                    timer_sessionCheck = setTimeout("notifyCheck('session_check');", 1e3 * gsValues.session_check)
                },
                success: function(e) {
                    "false" == e ? $("#blocking_panel").show() : timer_sessionCheck = setTimeout("notifyCheck('session_check');", 1e3 * gsValues.session_check)
                }
            })
    }
}

function placesSetListCheckbox(e, t) {
    null != document.getElementById(e) && (document.getElementById(e).checked = t)
}

function placesGroupOpen() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && ($("#places_group_list_grid").trigger("reloadGrid"), $("#dialog_places_groups").dialog("open"))
}

function placesGroupClose() {
    placesMarkerReload(), placesRouteReload(), placesZoneReload()
}

function placesGroupReload() {
    placesGroupLoadData(), $("#places_group_list_grid").trigger("reloadGrid")
}

function placesGroupLoadData(e) {
    var t = {
        cmd: "load_place_group_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_places.php",
        data: t,
        dataType: "json",
        cache: !1,
        success: function(t) {
            placesGroupData.groups = t, placesGroupData.edit_group_id = !1, initSelectList("places_group_list");
            for (var a in placesGroupData.groups) null != document.getElementById("marker_group_name_" + a) && (document.getElementById("marker_group_name_" + a).innerHTML = placesGroupData.groups[a].name), null != document.getElementById("route_group_name_" + a) && (document.getElementById("route_group_name_" + a).innerHTML = placesGroupData.groups[a].name), null != document.getElementById("zone_group_name_" + a) && (document.getElementById("zone_group_name_" + a).innerHTML = placesGroupData.groups[a].name);
            e(!0)
        }
    })
}

function placesGroupDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_place_group",
                group_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: a,
                success: function(e) {
                    "OK" == e && placesGroupReload()
                }
            })
        }
    })
}

function placesGroupDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#places_group_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_place_groups",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_places.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && placesGroupReload()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function placesGroupProperties(e) {
    switch (e) {
        default:
            var t = e;
            placesGroupData.edit_group_id = t, document.getElementById("dialog_places_group_name").value = placesGroupData.groups[t].name, document.getElementById("dialog_places_group_desc").value = placesGroupData.groups[t].desc, $("#dialog_places_group_properties").dialog("open");
            break;
        case "add":
            placesGroupData.edit_group_id = !1, document.getElementById("dialog_places_group_name").value = "", document.getElementById("dialog_places_group_desc").value = "", $("#dialog_places_group_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_places_group_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var a = document.getElementById("dialog_places_group_name").value,
                o = document.getElementById("dialog_places_group_desc").value;
            if ("" == a) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            var i = {
                cmd: "save_place_group",
                group_id: placesGroupData.edit_group_id,
                group_name: a,
                group_desc: o
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: i,
                cache: !1,
                success: function(e) {
                    "OK" == e && (placesGroupReload(), $("#dialog_places_group_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function placesGroupImport() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (document.getElementById("load_file").addEventListener("change", placesGroupImportPGRFile, !1), document.getElementById("load_file").click())
}

function placesGroupImportPGRFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.pgr) {
                var a = t.groups.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.GROUPS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "pgr",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && placesGroupReload()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectGroupImportOGRFile, !1)
}

function placesGroupExport() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy) {
        var e = "func/fn_export.php?format=pgr";
        window.location = e
    }
}

function placesImport() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (document.getElementById("load_file").addEventListener("change", placesImportPLCFile, !1), document.getElementById("load_file").click())
}

function placesImportPLCFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        if ("kml" == t[0].name.split(".").pop().toLowerCase()) var a = placesKMLToPLC(i = (new X2JS).xml_str2json(e.target.result)),
            o = JSON.stringify(a);
        else if ("csv" == t[0].name.split(".").pop().toLowerCase()) var i = csv2json(e.target.result),
            a = placesCSVToPLC(i),
            o = JSON.stringify(a);
        else var a = $.parseJSON(e.target.result),
            o = e.target.result;
        if ("0.1v" == a.plc) {
            var s = a.markers.length,
                n = a.routes.length,
                l = a.zones.length;
            if (0 == s && 0 == n && 0 == l) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
            confirmDialog(sprintf(la.MARKERS_ROUTES_ZONES_FOUND, s, n, l) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(e) {
                if (e) {
                    loadingData(!0);
                    var t = {
                        format: "plc",
                        data: o,
                        markers: !0,
                        routes: !0,
                        zones: !0
                    };
                    $.ajax({
                        type: "POST",
                        url: "func/fn_import.php",
                        data: t,
                        cache: !1,
                        success: function(e) {
                            loadingData(!1), "OK" == e ? (placesMarkerLoadData(), placesRouteLoadData(), placesZoneLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"), $("#side_panel_places_route_list_grid").trigger("reloadGrid"), $("#side_panel_places_zone_list_grid").trigger("reloadGrid")) : "ERROR_MARKER_LIMIT" == e ? notifyBox("error", la.ERROR, la.MARKER_LIMIT_IS_REACHED) : "ERROR_ROUTE_LIMIT" == e ? notifyBox("error", la.ERROR, la.ROUTE_LIMIT_IS_REACHED) : "ERROR_ZONE_LIMIT" == e && notifyBox("error", la.ERROR, la.ZONE_LIMIT_IS_REACHED)
                        },
                        error: function(e, t) {
                            loadingData(!1)
                        }
                    })
                }
            })
        } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT);
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", placesImportPLCFile, !1)
}

function placesExport() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy) {
        var e = "func/fn_export.php?format=plc";
        window.location = e
    }
}

function placesCSVToPLC(e) {
    for (var t = !1, a = {
            plc: "0.1v",
            markers: new Array,
            routes: new Array,
            zones: new Array
        }, o = 0; o < e.length; o++) {
        var i = e[o];
        if (0 == t && (void 0 != i.name && void 0 != i.desc && void 0 != i.icon && void 0 != i.visible && void 0 != i.lat && void 0 != i.lng ? t = "marker" : void 0 != i.name && void 0 != i.color && void 0 != i.visible && void 0 != i.name_visible && void 0 != i.deviation && void 0 != i.points ? t = "route" : void 0 != i.name && void 0 != i.color && void 0 != i.visible && void 0 != i.name_visible && void 0 != i.area && void 0 != i.vertices && (t = "zone")), "marker" == t) a.markers.push({
            name: i.name,
            desc: i.desc,
            icon: "img/markers/places/" + i.icon,
            visible: i.visible,
            lat: i.lat,
            lng: i.lng
        });
        else if ("route" == t) a.routes.push({
            name: i.name,
            color: i.color,
            visible: i.visible,
            name_visible: i.name_visible,
            deviation: i.deviation,
            points: i.points
        });
        else {
            if ("zone" != t) return a;
            a.zones.push({
                name: i.name,
                color: i.color,
                visible: i.visible,
                name_visible: i.name_visible,
                area: i.area,
                vertices: i.vertices
            })
        }
    }
    return a
}

function placesKMLToPLC(e) {
    for (var t = 1, a = 1, o = {
            plc: "0.1v",
            markers: new Array,
            routes: new Array,
            zones: new Array
        }, i = e.kml.Document.Placemark, s = 0; s < i.length - 1; s++) {
        var n = i[s];
        if (void 0 != n.Point) {
            if (void 0 != n.name) c = n.name;
            else {
                c = "Marker " + t;
                t += 1
            }
            if (void 0 != n.description.__text) l = n.description.toString();
            else var l = "";
            var r = "img/markers/places/pin-1.svg",
                d = (y = n.Point.coordinates.split(","))[0],
                _ = y[1];
            o.markers.push({
                name: c,
                desc: l,
                icon: r,
                visible: "true",
                lat: _,
                lng: d
            })
        }
        if (void 0 != n.Polygon) {
            if (void 0 != n.name) c = n.name;
            else {
                var c = "Zone " + a;
                a += 1
            }
            if (void 0 != n.Style.PolyStyle.color) g = "#" + n.Style.PolyStyle.color.slice(0, -2);
            else var g = "#FF0000";
            var m = n.Polygon.outerBoundaryIs.LinearRing.coordinates.split(" ");
            if (m.length <= 40) {
                for (var u = [], p = 0; p < m.length; p++) {
                    var y = m[p].split(","),
                        d = y[0],
                        _ = y[1];
                    u.push(parseFloat(_).toFixed(6) + "," + parseFloat(d).toFixed(6))
                }
                u = u.toString(), o.zones.push({
                    name: c,
                    color: g,
                    visible: "true",
                    name_visible: "true",
                    area: "0",
                    vertices: u
                })
            }
        }
    }
    return o
}

function placesMarkerReload() {
    placesGroupLoadData(), placesMarkerLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid")
}

function placesMarkerLoadData() {
    var e = {
        cmd: "load_marker_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_places.php",
        data: e,
        dataType: "json",
        cache: !1,
        success: function(e) {
            placesMarkerData.markers = e, placesMarkerInitLists(), placesMarkerSetListCheckbox(), placesMarkerSetListNumber(), "" != placesMarkerData.markers ? placesMarkerAddAllToMap() : placesMarkerRemoveAllFromMap()
        }
    })
}

function placesMarkerInitLists() {
    initSelectList("subaccounts_marker_list")
}

function placesMarkerSetListNumber() {
    document.getElementById("side_panel_places_markers_num").innerHTML = "(" + Object.keys(placesMarkerData.markers).length + ")"
}

function placesMarkerSetListCheckbox() {
    for (var e in placesGroupData.groups) placesSetListCheckbox("marker_group_visible_" + e, placesGroupData.groups[e].marker_visible);
    for (var e in placesMarkerData.markers) placesSetListCheckbox("marker_visible_" + e, placesMarkerData.markers[e].visible)
}

function placesMarkerAddAllToMap() {
    var e = document.getElementById("side_panel_places_marker_list_search").value;
    placesMarkerRemoveAllFromMap();
    for (var t in placesMarkerData.markers) {
        var a = placesMarkerData.markers[t];
        if (strMatches(a.data.name, e)) {
            var o = a.data.name,
                i = a.data.desc,
                s = a.data.icon,
                n = a.data.visible,
                l = a.data.lat,
                r = a.data.lng;
            try {
                placesMarkerAddMarkerToMap(t, o, i, s, n, l, r)
            } catch (e) {}
        }
    }
}

function placesMarkerAddMarkerToMap(e, t, a, o, i, s, n) {
    var l = settingsUserData.map_is,
        r = L.icon({
            iconUrl: o,
            iconSize: [28 * l, 28 * l],
            iconAnchor: [14 * l, 28 * l],
            popupAnchor: [0, 0]
        }),
        d = L.marker([s, n], {
            icon: r
        }),
        _ = "<table><tr><td><strong>" + t + "</strong></td></tr>";
    "" != a && (_ += "<tr><td>" + a + "</td></tr>"), _ += "</table>", d.on("click", function(e) {
        addPopupToMap(s, n, [0, -28 * l], _, "")
    }), "false" != i && mapLayers.places_markers.addLayer(d), placesMarkerData.markers[e].marker_layer = d
}

function placesMarkerRemoveAllFromMap() {
    mapLayers.places_markers.clearLayers()
}

function placesMarkerSearchMap(e) {
    for (var t in placesMarkerData.markers) {
        var a = placesMarkerData.markers[t];
        strMatches(a.data.name, e) ? 1 == a.visible && placesMarkerVisible(t, !0) : placesMarkerVisible(t, !1)
    }
}

function placesMarkerDeleteAll() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_MARKERS, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_markers"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: t,
                success: function(e) {
                    "OK" == e && (placesMarkerLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"))
                }
            })
        }
    })
}

function placesMarkerDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (placesMarkerPanTo(e), confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_marker",
                marker_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: a,
                success: function(t) {
                    "OK" == t && (placesMarkerVisible(e, !1), delete placesMarkerData.markers[e], placesMarkerSetListNumber(), placesMarkerInitLists(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid"))
                }
            })
        }
    }))
}

function placesMarkerNew(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("dialog_places_marker_name").value = la.NEW_MARKER + " " + placesMarkerData.new_marker_id, document.getElementById("dialog_places_marker_desc").value = "", document.getElementById("dialog_places_marker_group").value = 0, $("#dialog_places_marker_group").multipleSelect("refresh"), document.getElementById("dialog_places_marker_visible").checked = !0, $("#dialog_places_marker_properties").dialog("open"), placesMarkerLoadDefaultIconList(), placesMarkerLoadCustomIconList(), void 0 != e && (map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), placesMarkerAddToMap(e.lat, e.lng, placesMarkerData.marker_icon)), map.on("click", placesMarkerAddToMapByClick))
}

function placesMarkerAddToMapByClick(e) {
    map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), placesMarkerAddToMap(e.latlng.lat, e.latlng.lng, placesMarkerData.marker_icon)
}

function placesMarkerAddToMap(e, t, a) {
    var o = settingsUserData.map_is,
        i = L.icon({
            iconUrl: a,
            iconSize: [28 * o, 28 * o],
            iconAnchor: [14 * o, 28 * o],
            popupAnchor: [0, 0]
        });
    placesMarkerData.edit_marker_layer = L.marker([e, t], {
        icon: i
    }), placesMarkerData.edit_marker_layer.addTo(map)
}

function placesMarkerProperties(e) {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) switch (e) {
        default:
            if (1 == gsValues.map_bussy) return;
            map.doubleClickZoom.disable(), gsValues.map_bussy = !0;
            t = e;
            placesMarkerData.edit_marker_id = t, document.getElementById("dialog_places_marker_name").value = placesMarkerData.markers[t].data.name, document.getElementById("dialog_places_marker_desc").value = placesMarkerData.markers[t].data.desc, document.getElementById("dialog_places_marker_group").value = placesMarkerData.markers[t].data.group_id, $("#dialog_places_marker_group").multipleSelect("refresh"), "true" == placesMarkerData.markers[t].data.visible ? document.getElementById("dialog_places_marker_visible").checked = !0 : document.getElementById("dialog_places_marker_visible").checked = !1, placesMarkerData.marker_icon = placesMarkerData.markers[t].data.icon, $("#dialog_places_marker_properties").dialog("open"), placesMarkerLoadDefaultIconList(), placesMarkerLoadCustomIconList(), mapLayers.places_markers.removeLayer(placesMarkerData.markers[t].marker_layer), placesMarkerAddToMap((l = placesMarkerData.markers[t].marker_layer.getLatLng()).lat, l.lng, placesMarkerData.marker_icon), map.on("click", placesMarkerAddToMapByClick);
            break;
        case "cancel":
            if (map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), map.off("click"), 0 != placesMarkerData.edit_marker_id) {
                var t = placesMarkerData.edit_marker_id;
                "false" == placesMarkerData.markers[t].data.visible ? mapLayers.places_markers.removeLayer(placesMarkerData.markers[t].marker_layer) : mapLayers.places_markers.addLayer(placesMarkerData.markers[t].marker_layer)
            }
            placesMarkerData.edit_marker_id = !1, placesMarkerData.edit_marker_layer = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_marker_properties").dialog("close");
            break;
        case "save":
            var a = document.getElementById("dialog_places_marker_name").value,
                o = document.getElementById("dialog_places_marker_desc").value,
                i = document.getElementById("dialog_places_marker_group").value,
                s = document.getElementById("dialog_places_marker_visible").checked,
                n = placesMarkerData.marker_icon;
            if ("" == a) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            if (0 == placesMarkerData.edit_marker_layer) {
                notifyBox("error", la.ERROR, la.PLACE_MARKER_ON_MAP_BEFORE_SAVING);
                break
            }
            var l = placesMarkerData.edit_marker_layer.getLatLng();
            map.off("click"), map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer), 0 == placesMarkerData.edit_marker_id && (placesMarkerData.new_marker_id += 1);
            var r = {
                cmd: "save_marker",
                marker_id: placesMarkerData.edit_marker_id,
                group_id: i,
                marker_name: a,
                marker_desc: o,
                marker_icon: n,
                marker_visible: s,
                marker_lat: l.lat.toFixed(6),
                marker_lng: l.lng.toFixed(6)
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: r,
                success: function(e) {
                    placesMarkerData.edit_marker_layer = !1, placesMarkerData.edit_marker_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_marker_properties").dialog("close"), "OK" == e ? (placesMarkerLoadData(), $("#side_panel_places_marker_list_grid").trigger("reloadGrid")) : "ERROR_MARKER_LIMIT" == e && notifyBox("error", la.ERROR, la.MARKER_LIMIT_IS_REACHED)
                }
            })
    }
}

function placesMarkerLoadDefaultIconList() {
    0 == placesMarkerData.default_icons_loaded && $.ajax({
        type: "POST",
        url: "func/fn_files.php",
        data: {
            path: "img/markers/places"
        },
        dataType: "json",
        success: function(e) {
            var t = '<div class="row2">';
            for (document.getElementById("places_marker_icon_default_list").innerHTML = "", i = 0; i < e.length; i++) {
                var a = "img/markers/places/" + e[i];
                t += '<div class="icon-places-marker">', t += '<a href="#" onclick="placesMarkerSelectIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += "</div>"
            }
            t += "</div>", document.getElementById("places_marker_icon_default_list").innerHTML = t, placesMarkerData.default_icons_loaded = !0
        }
    })
}

function placesMarkerLoadCustomIconList() {
    0 == placesMarkerData.custom_icons_loaded && $.ajax({
        type: "POST",
        url: "func/fn_files.php",
        data: {
            path: "data/user/places"
        },
        dataType: "json",
        success: function(e) {
            var t = '<div class="row2">';
            for (document.getElementById("places_marker_icon_custom_list").innerHTML = "", i = 0; i < e.length; i++) {
                var a = "data/user/places/" + e[i];
                t += '<div class="icon-places-marker">', t += '<a href="#" onclick="placesMarkerSelectIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += '<div class="icon-custom-delete">', t += '<a href="#" onclick="placesMarkerDeleteCustomIcon(\'' + a + "');\">", t += '<img border="0" src="theme/images/remove.svg" width="8px">', t += "</a>", t += "</div>", t += "</div>"
            }
            t += "</div>", document.getElementById("places_marker_icon_custom_list").innerHTML = t, placesMarkerData.custom_icons_loaded = !0
        }
    })
}

function placesMarkerUploadCustomIcon() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", placesMarkerUploadCustomIconFile, !1), document.getElementById("load_file").click())
}

function placesMarkerUploadCustomIconFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onloadend = function(e) {
        var a = e.target.result;
        if ("image/png" == t[0].type || "image/svg+xml" == t[0].type) {
            var o = new Image;
            o.src = a, o.onload = function() {
                if (o.src.includes("image/png")) {
                    if (32 != o.width || 32 != o.height) return void notifyBox("error", la.ERROR, la.ICON_SIZE_SHOULD_BE_32_32);
                    e = "func/fn_upload.php?file=places_icon_png"
                } else var e = "func/fn_upload.php?file=places_icon_svg";
                $.ajax({
                    url: e,
                    type: "POST",
                    data: a,
                    processData: !1,
                    contentType: !1,
                    success: function(e) {
                        placesMarkerData.custom_icons_loaded = !1, placesMarkerLoadCustomIconList()
                    }
                })
            }, document.getElementById("load_file").value = ""
        } else notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_PNG_OR_SVG)
    }, a.readAsDataURL(t[0]), this.removeEventListener("change", placesMarkerUploadCustomIconFile, !1)
}

function placesMarkerDeleteCustomIcon(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ICON, function(t) {
        if (t) {
            var a = {
                cmd: "delete_custom_icon",
                file: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: a,
                success: function(e) {
                    "OK" == e && (placesMarkerData.custom_icons_loaded = !1, placesMarkerLoadCustomIconList())
                }
            })
        }
    })
}

function placesMarkerDeleteAllCustomIcon() {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_CUSTOM_ICONS, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_custom_icons"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: t,
                success: function(e) {
                    "OK" == e && (placesMarkerData.custom_icons_loaded = !1, placesMarkerLoadCustomIconList())
                }
            })
        }
    })
}

function placesMarkerSelectIcon(e) {
    if (placesMarkerData.marker_icon = e, 0 != placesMarkerData.edit_marker_layer) {
        map.hasLayer(placesMarkerData.edit_marker_layer) && map.removeLayer(placesMarkerData.edit_marker_layer);
        var t = placesMarkerData.edit_marker_layer.getLatLng();
        placesMarkerAddToMap(t.lat, t.lng, placesMarkerData.marker_icon)
    }
}

function placesMarkerPanTo(e) {
    try {
        var t = placesMarkerData.markers[e].data.lng,
            a = placesMarkerData.markers[e].data.lat;
        map.panTo({
            lat: a,
            lng: t
        })
    } catch (e) {}
}

function placesMarkerVisibleToggle(e) {
    var t = document.getElementById("marker_visible_" + e).checked;
    placesMarkerData.markers[e].visible = t, placesMarkerVisible(e, t)
}

function placesMarkerVisible(e, t) {
    var a = placesMarkerData.markers[e].marker_layer;
    1 == t ? "true" == placesMarkerData.markers[e].data.visible && mapLayers.places_markers.addLayer(a) : mapLayers.places_markers.removeLayer(a)
}

function markerGroupVisibleToggle(e) {
    var t = document.getElementById("marker_group_visible_" + e).checked;
    for (var a in placesMarkerData.markers) placesMarkerData.markers[a].data.group_id == e && (placesGroupData.groups[e].marker_visible = t, placesMarkerData.markers[a].visible = t, placesSetListCheckbox("marker_visible_" + a, t), placesMarkerVisible(a, t))
}

function placesMarkerVisibleAllToggle() {
    placesMarkerVisibleAll(1 == gsValues.map_markers ? !1 : !0)
}

function placesMarkerVisibleAll(e) {
    if (gsValues.map_markers = e, 1 == e) {
        for (var t in placesGroupData.groups) placesGroupData.groups[t].marker_visible = !0, placesSetListCheckbox("marker_group_visible_" + t, !0);
        for (var t in placesMarkerData.markers) placesMarkerData.markers[t].visible = !0, placesSetListCheckbox("marker_visible_" + t, !0), placesMarkerVisible(t, !0)
    } else {
        for (var t in placesGroupData.groups) placesGroupData.groups[t].marker_visible = !1, placesSetListCheckbox("marker_group_visible_" + t, !1);
        for (var t in placesMarkerData.markers) placesMarkerData.markers[t].visible = !1, placesSetListCheckbox("marker_visible_" + t, !1);
        placesMarkerRemoveAllFromMap()
    }
}

function placesZoneReload() {
    placesGroupLoadData(), placesZoneLoadData(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid")
}

function placesZoneLoadData() {
    var e = {
        cmd: "load_zone_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_places.php",
        data: e,
        dataType: "json",
        cache: !1,
        success: function(e) {
            placesZoneData.zones = e, placesZoneInitLists(), placesZoneSetListCheckbox(), placesZoneSetListNumber(), "" != placesZoneData.zones ? placesZoneAddAllToMap() : placesZoneRemoveAllFromMap()
        }
    })
}

function placesZoneInitLists() {
    initSelectList("report_zone_list"), initSelectList("events_zone_list"), initSelectList("subaccounts_zone_list")
}

function placesZoneSetListNumber() {
    document.getElementById("side_panel_places_zones_num").innerHTML = "(" + Object.keys(placesZoneData.zones).length + ")"
}

function placesZoneSetListCheckbox() {
    for (var e in placesGroupData.groups) placesSetListCheckbox("zone_group_visible_" + e, placesGroupData.groups[e].zone_visible);
    for (var e in placesZoneData.zones) placesSetListCheckbox("zone_visible_" + e, placesZoneData.zones[e].visible)
}

function placesZoneAddAllToMap() {
    var e = document.getElementById("side_panel_places_zone_list_search").value;
    placesZoneRemoveAllFromMap();
    for (var t in placesZoneData.zones) {
        var a = placesZoneData.zones[t];
        if (strMatches(a.data.name, e)) {
            var o = a.data.name,
                i = a.data.color,
                s = a.data.visible,
                n = a.data.name_visible,
                l = a.data.area,
                r = a.data.vertices;
            try {
                placesZoneAddZoneToMap(t, o, i, s, n, l, r)
            } catch (e) {}
        }
    }
}

function placesZoneAddZoneToMap(e, t, a, o, i, s, n) {
    var l = placesZoneVerticesStringToLatLngs(n),
        r = L.polygon(l, {
            color: a,
            fill: !0,
            fillColor: a,
            fillOpacity: .4,
            opacity: .8,
            weight: 3
        });
    "false" == i && (t = ""), "0" != s && (measure_area = getAreaFromLatLngs(r.getLatLngs()[0]), "1" == s && (measure_area *= 247105e-9, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_ACRE), "2" == s && (measure_area *= 1e-4, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_HECTARES), "3" == s && (measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_M), "4" == s && (measure_area *= 1e-6, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_KM), "5" == s && (measure_area *= 10.7639, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_FT), "6" == s && (measure_area = 1e-6 * measure_area * .386102, measure_area = Math.round(100 * measure_area) / 100, measure_area = measure_area + " " + la.UNIT_SQ_MI), t = t + " (" + measure_area + ")");
    var d = r.getBounds().getCenter(),
        _ = L.tooltip({
            permanent: !0,
            direction: "center"
        });
    _.setLatLng(d), _.setContent(t), "false" != o && mapLayers.places_zones.addLayer(r), "false" == i && "0" == s || mapLayers.places_zones.addLayer(_), placesZoneData.zones[e].zone_layer = r, placesZoneData.zones[e].label_layer = _
}

function placesZoneRemoveAllFromMap() {
    mapLayers.places_zones.clearLayers()
}

function placesZoneSearchMap(e) {
    for (var t in placesZoneData.zones) {
        var a = placesZoneData.zones[t];
        strMatches(a.data.name, e) ? 1 == a.visible && placesZoneVisible(t, !0) : placesZoneVisible(t, !1)
    }
}

function placesZoneDeleteAll() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_zones"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: t,
                success: function(e) {
                    "OK" == e && (placesZoneLoadData(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid"))
                }
            })
        }
    })
}

function placesZoneDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (placesZonePanTo(e), confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_zone",
                zone_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: a,
                success: function(t) {
                    "OK" == t && (placesZoneVisible(e, !1), delete placesZoneData.zones[e], placesZoneSetListNumber(), placesZoneInitLists(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid"))
                }
            })
        }
    }))
}

function placesZoneNew(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("dialog_places_zone_name").value = la.NEW_ZONE + " " + placesZoneData.new_zone_id, document.getElementById("dialog_places_zone_group").value = 0, $("#dialog_places_zone_group").multipleSelect("refresh"), document.getElementById("dialog_places_zone_color").value = "FF0000", document.getElementById("dialog_places_zone_color").style.backgroundColor = "#FF0000", document.getElementById("dialog_places_zone_visible").checked = !0, document.getElementById("dialog_places_zone_name_visible").checked = !0, document.getElementById("dialog_places_zone_area").value = 0, $("#dialog_places_zone_area").multipleSelect("refresh"), $("#dialog_places_zone_properties").dialog("open"), void 0 != e ? map.editTools.startPolygon(e) : map.editTools.startPolygon(), map.on("editable:drawing:end", function(e) {
        placesZoneData.edit_zone_layer = e.layer, placesZoneData.edit_zone_layer.getLatLngs()[0].length < 3 ? placesZoneProperties("cancel") : placesZoneData.edit_zone_layer.getLatLngs()[0].length > 40 ? notifyBox("error", la.ERROR, la.ZONE_CANT_HAVE_MORE_THAN_NUM_VERTICES) : map.off("editable:drawing:end")
    }))
}

function placesZoneLatLngsToVerticesString(e) {
    for (var t = [], a = 0; a < e.length; a++) {
        var o = e[a],
            i = o.lat,
            s = o.lng;
        t.push(parseFloat(i).toFixed(6) + "," + parseFloat(s).toFixed(6))
    }
    return t.push(t[0]), t.toString()
}

function placesZoneVerticesStringToLatLngs(e) {
    var t = e.split(","),
        a = [];
    for (j = 0; j < t.length; j += 2) lat = t[j], lng = t[j + 1], a.push(L.latLng(lat, lng));
    return a
}

function placesZoneProperties(e) {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) switch (e) {
        default:
            if (1 == gsValues.map_bussy) return;
            map.doubleClickZoom.disable(), gsValues.map_bussy = !0;
            var t = e;
            placesZoneData.edit_zone_id = t, document.getElementById("dialog_places_zone_name").value = placesZoneData.zones[t].data.name, document.getElementById("dialog_places_zone_group").value = placesZoneData.zones[t].data.group_id, $("#dialog_places_zone_group").multipleSelect("refresh"), document.getElementById("dialog_places_zone_color").value = placesZoneData.zones[t].data.color.substr(1), document.getElementById("dialog_places_zone_color").style.backgroundColor = placesZoneData.zones[t].data.color, document.getElementById("dialog_places_zone_visible").checked = strToBoolean(placesZoneData.zones[t].data.visible), document.getElementById("dialog_places_zone_name_visible").checked = strToBoolean(placesZoneData.zones[t].data.name_visible), document.getElementById("dialog_places_zone_area").value = placesZoneData.zones[t].data.area, $("#dialog_places_zone_area").multipleSelect("refresh"), $("#dialog_places_zone_properties").dialog("open"), placesZoneVisible(placesZoneData.edit_zone_id, !1);
            var a = (i = placesZoneData.zones[placesZoneData.edit_zone_id]).data.color,
                o = placesZoneVerticesStringToLatLngs(i.data.vertices);
            placesZoneData.edit_zone_layer = L.polygon(o, {
                color: a,
                fill: !0,
                fillColor: a,
                fillOpacity: .4,
                opacity: .8,
                weight: 3
            }), map.addLayer(placesZoneData.edit_zone_layer), placesZoneFitBounds(t), setTimeout(function() {
                placesZoneData.edit_zone_layer.enableEdit()
            }, 200);
            break;
        case "cancel":
            map.editTools.stopDrawing(), map.off("editable:drawing:end"), map.hasLayer(placesZoneData.edit_zone_layer) && map.removeLayer(placesZoneData.edit_zone_layer);
            var i = placesZoneData.zones[placesZoneData.edit_zone_id];
            0 != placesZoneData.edit_zone_id && 1 == i.visible && placesZoneVisible(placesZoneData.edit_zone_id, !0), placesZoneData.edit_zone_layer = !1, placesZoneData.edit_zone_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_zone_properties").dialog("close");
            break;
        case "save":
            var s = document.getElementById("dialog_places_zone_name").value,
                n = document.getElementById("dialog_places_zone_group").value,
                l = "#" + document.getElementById("dialog_places_zone_color").value,
                r = document.getElementById("dialog_places_zone_visible").checked,
                d = document.getElementById("dialog_places_zone_name_visible").checked,
                _ = document.getElementById("dialog_places_zone_area").value;
            if ("" == s) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            if (!placesZoneData.edit_zone_layer) {
                notifyBox("error", la.ERROR, la.DRAW_ZONE_ON_MAP_BEFORE_SAVING);
                break
            }
            if (placesZoneData.edit_zone_layer.getLatLngs()[0].length < 3) {
                notifyBox("error", la.ERROR, la.DRAW_ZONE_ON_MAP_BEFORE_SAVING);
                break
            }
            if (placesZoneData.edit_zone_layer.getLatLngs()[0].length > 40) return void notifyBox("error", la.ERROR, la.ZONE_CANT_HAVE_MORE_THAN_NUM_VERTICES);
            var c = placesZoneLatLngsToVerticesString(placesZoneData.edit_zone_layer.getLatLngs()[0]);
            map.off("editable:drawing:end"), map.editTools.stopDrawing(), map.hasLayer(placesZoneData.edit_zone_layer) && map.removeLayer(placesZoneData.edit_zone_layer), 0 == placesZoneData.edit_zone_id && (placesZoneData.new_zone_id += 1);
            var g = {
                cmd: "save_zone",
                zone_id: placesZoneData.edit_zone_id,
                group_id: n,
                zone_name: s,
                zone_color: l,
                zone_visible: r,
                zone_name_visible: d,
                zone_area: _,
                zone_vertices: c
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: g,
                success: function(e) {
                    placesZoneData.edit_zone_layer = !1, placesZoneData.edit_zone_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_zone_properties").dialog("close"), "OK" == e ? (placesZoneLoadData(), $("#side_panel_places_zone_list_grid").trigger("reloadGrid")) : "ERROR_ZONE_LIMIT" == e && notifyBox("error", la.ERROR, la.ZONE_LIMIT_IS_REACHED)
                }
            })
    }
}

function placesZonePanTo(e) {
    try {
        var t = placesZoneData.zones[e].zone_layer.getBounds().getCenter();
        map.panTo(t)
    } catch (e) {}
}

function placesZoneFitBounds(e) {
    var t = placesZoneData.zones[e].zone_layer.getBounds();
    map.fitBounds(t)
}

function placesZoneVisibleToggle(e) {
    var t = document.getElementById("zone_visible_" + e).checked;
    placesZoneData.zones[e].visible = t, placesZoneVisible(e, t)
}

function placesZoneVisible(e, t) {
    var a = placesZoneData.zones[e].zone_layer,
        o = placesZoneData.zones[e].label_layer;
    1 == t ? ("true" == placesZoneData.zones[e].data.visible ? mapLayers.places_zones.addLayer(a) : mapLayers.places_zones.removeLayer(a), "true" == placesZoneData.zones[e].data.name_visible || "0" != placesZoneData.zones[e].data.area ? mapLayers.places_zones.addLayer(o) : mapLayers.places_zones.removeLayer(o)) : (mapLayers.places_zones.removeLayer(a), mapLayers.places_zones.removeLayer(o))
}

function zoneGroupVisibleToggle(e) {
    var t = document.getElementById("zone_group_visible_" + e).checked;
    for (var a in placesZoneData.zones) placesZoneData.zones[a].data.group_id == e && (placesGroupData.groups[e].zone_visible = t, placesZoneData.zones[a].visible = t, placesSetListCheckbox("zone_visible_" + a, t), placesZoneVisible(a, t))
}

function placesZoneVisibleAllToggle() {
    placesZoneVisibleAll(1 == gsValues.map_zones ? !1 : !0)
}

function placesZoneVisibleAll(e) {
    if (gsValues.map_zones = e, 1 == e) {
        for (var t in placesGroupData.groups) placesGroupData.groups[t].zone_visible = !0, placesSetListCheckbox("zone_group_visible_" + t, !0);
        for (var t in placesZoneData.zones) placesZoneData.zones[t].visible = !0, placesSetListCheckbox("zone_visible_" + t, !0), placesZoneVisible(t, !0)
    } else {
        for (var t in placesGroupData.groups) placesGroupData.groups[t].zone_visible = !1, placesSetListCheckbox("zone_group_visible_" + t, !1);
        for (var t in placesZoneData.zones) placesZoneData.zones[t].visible = !1, placesSetListCheckbox("zone_visible_" + t, !1);
        placesZoneRemoveAllFromMap()
    }
}

function placesRouteReload() {
    placesGroupLoadData(), placesRouteLoadData(), $("#side_panel_places_route_list_grid").trigger("reloadGrid")
}

function placesRouteLoadData() {
    var e = {
        cmd: "load_route_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_places.php",
        data: e,
        dataType: "json",
        cache: !1,
        success: function(e) {
            placesRouteData.routes = e, placesRouteInitLists(), placesRouteSetListCheckbox(), placesRouteSetListNumber(), "" != placesRouteData.routes ? placesRouteAddAllToMap() : placesRouteRemoveAllFromMap()
        }
    })
}

function placesRouteInitLists() {
    initSelectList("events_route_list"), initSelectList("subaccounts_route_list")
}

function placesRouteSetListNumber() {
    document.getElementById("side_panel_places_routes_num").innerHTML = "(" + Object.keys(placesRouteData.routes).length + ")"
}

function placesRouteSetListCheckbox() {
    for (var e in placesGroupData.groups) placesSetListCheckbox("route_group_visible_" + e, placesGroupData.groups[e].route_visible);
    for (var e in placesRouteData.routes) placesSetListCheckbox("route_visible_" + e, placesRouteData.routes[e].visible)
}

function placesRouteAddAllToMap() {
    var e = document.getElementById("side_panel_places_route_list_search").value;
    placesRouteRemoveAllFromMap();
    for (var t in placesRouteData.routes) {
        var a = placesRouteData.routes[t];
        if (strMatches(a.data.name, e)) {
            var o = a.data.name,
                i = a.data.color,
                s = a.data.visible,
                n = a.data.name_visible,
                l = a.data.points;
            try {
                placesRouteAddRouteToMap(t, o, i, s, n, l)
            } catch (e) {}
        }
    }
}

function placesRouteAddRouteToMap(e, t, a, o, i, s) {
    var n = placesRoutePointsStringToLatLngs(s),
        l = L.polyline(n, {
            color: a,
            fill: !1,
            opacity: .8,
            weight: 3
        }),
        r = n[0],
        d = L.tooltip({
            permanent: !0,
            direction: "top"
        });
    d.setLatLng(r), d.setContent(t), "false" != o && mapLayers.places_routes.addLayer(l), "false" != i && mapLayers.places_routes.addLayer(d), placesRouteData.routes[e].route_layer = l, placesRouteData.routes[e].label_layer = d
}

function placesRouteRemoveAllFromMap() {
    mapLayers.places_routes.clearLayers()
}

function placesRouteSearchMap(e) {
    for (var t in placesRouteData.routes) {
        var a = placesRouteData.routes[t];
        strMatches(a.data.name, e) ? 1 == a.visible && placesRouteVisible(t, !0) : placesRouteVisible(t, !1)
    }
}

function placesRouteDeleteAll() {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_ROUTES, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_routes"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: t,
                success: function(e) {
                    "OK" == e && (placesRouteLoadData(), $("#side_panel_places_route_list_grid").trigger("reloadGrid"))
                }
            })
        }
    })
}

function placesRouteDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (placesRoutePanTo(e), confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_route",
                route_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: a,
                success: function(t) {
                    "OK" == t && (placesRouteVisible(e, !1), delete placesRouteData.routes[e], placesRouteSetListNumber(), placesRouteInitLists(), $("#side_panel_places_route_list_grid").trigger("reloadGrid"))
                }
            })
        }
    }))
}

function placesRouteSave(e) {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy) {
        gsValues.map_bussy = !0, document.getElementById("side_panel_places_tab").click(), document.getElementById("side_panel_places_routes_tab").click(), document.getElementById("dialog_places_route_name").value = la.NEW_ROUTE + " " + placesRouteData.new_route_id, document.getElementById("dialog_places_route_group").value = 0, $("#dialog_places_route_group").multipleSelect("refresh"), document.getElementById("dialog_places_route_color").value = "FF0000", document.getElementById("dialog_places_route_color").style.backgroundColor = "#FF0000", document.getElementById("dialog_places_route_visible").checked = !0, document.getElementById("dialog_places_route_name_visible").checked = !0, document.getElementById("dialog_places_route_deviation").value = "0.5", $("#dialog_places_route_properties").dialog("open");
        var t = "#FF0000";
        placesRouteData.edit_route_layer = L.polyline(e, {
            color: t,
            fill: !1,
            opacity: .8,
            weight: 3
        }), map.addLayer(placesRouteData.edit_route_layer), placesRouteData.edit_route_layer.enableEdit();
        var a = placesRouteData.edit_route_layer.getBounds();
        map.fitBounds(a)
    }
}

function placesRouteNew(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && 1 != gsValues.map_bussy && (map.doubleClickZoom.disable(), gsValues.map_bussy = !0, document.getElementById("dialog_places_route_name").value = la.NEW_ROUTE + " " + placesRouteData.new_route_id, document.getElementById("dialog_places_route_group").value = 0, $("#dialog_places_route_group").multipleSelect("refresh"), document.getElementById("dialog_places_route_color").value = "FF0000", document.getElementById("dialog_places_route_color").style.backgroundColor = "#FF0000", document.getElementById("dialog_places_route_visible").checked = !0, document.getElementById("dialog_places_route_name_visible").checked = !0, document.getElementById("dialog_places_route_deviation").value = "0.5", $("#dialog_places_route_properties").dialog("open"), void 0 != e ? (map.editTools.startPolyline(e), placesRouteData.edit_start_label_layer = L.tooltip({
        permanent: !0,
        offset: [10, 0],
        direction: "right"
    }), placesRouteData.edit_start_label_layer.setLatLng(e), placesRouteData.edit_start_label_layer.setContent(la.ROUTE_START), map.addLayer(placesRouteData.edit_start_label_layer)) : map.editTools.startPolyline(), map.on("editable:editing editable:drag", function(e) {
        placesRouteData.edit_route_layer = e.layer;
        var t = placesRouteData.edit_route_layer.getLatLngs(),
            a = t[0],
            o = t[t.length - 1];
        map.hasLayer(placesRouteData.edit_start_label_layer) ? placesRouteData.edit_start_label_layer.setLatLng(a) : (placesRouteData.edit_start_label_layer = L.tooltip({
            permanent: !0,
            offset: [10, 0],
            direction: "right"
        }), placesRouteData.edit_start_label_layer.setLatLng(o), placesRouteData.edit_start_label_layer.setContent(la.ROUTE_START), map.addLayer(placesRouteData.edit_start_label_layer)), t.length > 1 && (map.hasLayer(placesRouteData.edit_end_label_layer) ? placesRouteData.edit_end_label_layer.setLatLng(o) : (placesRouteData.edit_end_label_layer = L.tooltip({
            permanent: !0,
            offset: [10, 0],
            direction: "right"
        }), placesRouteData.edit_end_label_layer.setLatLng(o), placesRouteData.edit_end_label_layer.setContent(la.ROUTE_END), map.addLayer(placesRouteData.edit_end_label_layer)))
    }))
}

function placesRouteLatLngsToPointsString(e) {
    for (var t = [], a = 0; a < e.length; a++) {
        var o = e[a],
            i = o.lat,
            s = o.lng;
        t.push(parseFloat(i).toFixed(6) + "," + parseFloat(s).toFixed(6))
    }
    return t.toString()
}

function placesRoutePointsStringToLatLngs(e) {
    var t = e.split(","),
        a = [];
    for (j = 0; j < t.length; j += 2) lat = t[j], lng = t[j + 1], a.push(L.latLng(lat, lng));
    return a
}

function placesRouteProperties(e) {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser")) switch (e) {
        default:
            if (1 == gsValues.map_bussy) return;
            map.doubleClickZoom.disable(), gsValues.map_bussy = !0;
            var t = e;
            placesRouteData.edit_route_id = t, document.getElementById("dialog_places_route_name").value = placesRouteData.routes[t].data.name, document.getElementById("dialog_places_route_group").value = placesRouteData.routes[t].data.group_id, $("#dialog_places_route_group").multipleSelect("refresh"), document.getElementById("dialog_places_route_color").value = placesRouteData.routes[t].data.color.substr(1), document.getElementById("dialog_places_route_color").style.backgroundColor = placesRouteData.routes[t].data.color, document.getElementById("dialog_places_route_visible").checked = strToBoolean(placesRouteData.routes[t].data.visible), document.getElementById("dialog_places_route_name_visible").checked = strToBoolean(placesRouteData.routes[t].data.name_visible), document.getElementById("dialog_places_route_deviation").value = placesRouteData.routes[t].data.deviation, $("#dialog_places_route_properties").dialog("open"), placesRouteVisible(placesRouteData.edit_route_id, !1);
            var a = (i = placesRouteData.routes[placesRouteData.edit_route_id]).data.color,
                o = placesRoutePointsStringToLatLngs(i.data.points);
            placesRouteData.edit_route_layer = L.polyline(o, {
                color: a,
                fill: !1,
                opacity: .8,
                weight: 3
            }), map.addLayer(placesRouteData.edit_route_layer), placesRouteFitBounds(t), setTimeout(function() {
                placesRouteData.edit_route_layer.enableEdit()
            }, 200);
            break;
        case "cancel":
            map.off("editable:editing editable:drag"), map.editTools.stopDrawing(), map.hasLayer(placesRouteData.edit_route_layer) && map.removeLayer(placesRouteData.edit_route_layer), map.hasLayer(placesRouteData.edit_start_label_layer) && map.removeLayer(placesRouteData.edit_start_label_layer), map.hasLayer(placesRouteData.edit_end_label_layer) && map.removeLayer(placesRouteData.edit_end_label_layer);
            var i = placesRouteData.routes[placesRouteData.edit_route_id];
            0 != placesRouteData.edit_route_id && 1 == i.visible && placesRouteVisible(placesRouteData.edit_route_id, !0), placesRouteData.edit_route_layer = !1, placesRouteData.edit_start_label_layer = !1, placesRouteData.edit_end_label_layer = !1, placesRouteData.edit_route_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_route_properties").dialog("close");
            break;
        case "save":
            var s = document.getElementById("dialog_places_route_name").value,
                n = document.getElementById("dialog_places_route_group").value,
                l = "#" + document.getElementById("dialog_places_route_color").value,
                r = document.getElementById("dialog_places_route_visible").checked,
                d = document.getElementById("dialog_places_route_name_visible").checked,
                _ = document.getElementById("dialog_places_route_deviation").value;
            if ("" == s) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            if (_ < 0 || "" == _) {
                notifyBox("error", la.ERROR, la.DEVIATION_CANT_BE_LESS_THAN_0);
                break
            }
            if (!placesRouteData.edit_route_layer) {
                notifyBox("error", la.ERROR, la.DRAW_ROUTE_ON_MAP_BEFORE_SAVING);
                break
            }
            if (placesRouteData.edit_route_layer.getLatLngs().length < 2) {
                notifyBox("error", la.ERROR, la.DRAW_ROUTE_ON_MAP_BEFORE_SAVING);
                break
            }
            if (placesRouteData.edit_route_layer.getLatLngs().length > 200) return void notifyBox("error", la.ERROR, la.ROUTE_CANT_HAVE_MORE_THAN_NUM_POINTS);
            o = placesRouteLatLngsToPointsString(placesRouteData.edit_route_layer.getLatLngs());
            map.off("editable:editing editable:drag"), map.editTools.stopDrawing(), map.hasLayer(placesRouteData.edit_route_layer) && map.removeLayer(placesRouteData.edit_route_layer), map.hasLayer(placesRouteData.edit_start_label_layer) && map.removeLayer(placesRouteData.edit_start_label_layer), map.hasLayer(placesRouteData.edit_end_label_layer) && map.removeLayer(placesRouteData.edit_end_label_layer), 0 == placesRouteData.edit_route_id && (placesRouteData.new_route_id += 1);
            var c = {
                cmd: "save_route",
                route_id: placesRouteData.edit_route_id,
                group_id: n,
                route_name: s,
                route_color: l,
                route_visible: r,
                route_name_visible: d,
                route_deviation: _,
                route_points: o
            };
            $.ajax({
                type: "POST",
                url: "func/fn_places.php",
                data: c,
                success: function(e) {
                    placesRouteData.edit_route_layer = !1, placesRouteData.edit_start_label_layer = !1, placesRouteData.edit_end_label_layer = !1, placesRouteData.edit_route_id = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable(), $("#dialog_places_route_properties").dialog("close"), "OK" == e ? (placesRouteLoadData(), $("#side_panel_places_route_list_grid").trigger("reloadGrid")) : "ERROR_ROUTE_LIMIT" == e && notifyBox("error", la.ERROR, la.ROUTE_LIMIT_IS_REACHED)
                }
            })
    }
}

function placesRoutePanTo(e) {
    try {
        var t = placesRouteData.routes[e].route_layer.getBounds().getCenter();
        map.panTo(t)
    } catch (e) {}
}

function placesRouteFitBounds(e) {
    var t = placesRouteData.routes[e].route_layer.getBounds();
    map.fitBounds(t)
}

function placesRouteVisibleToggle(e) {
    var t = document.getElementById("route_visible_" + e).checked;
    placesRouteData.routes[e].visible = t, placesRouteVisible(e, t)
}

function placesRouteVisible(e, t) {
    var a = placesRouteData.routes[e].route_layer,
        o = placesRouteData.routes[e].label_layer;
    1 == t ? ("true" == placesRouteData.routes[e].data.visible ? mapLayers.places_routes.addLayer(a) : mapLayers.places_routes.removeLayer(a), "true" == placesRouteData.routes[e].data.name_visible ? mapLayers.places_routes.addLayer(o) : mapLayers.places_routes.removeLayer(o)) : (mapLayers.places_routes.removeLayer(a), mapLayers.places_routes.removeLayer(o))
}

function routeGroupVisibleToggle(e) {
    var t = document.getElementById("route_group_visible_" + e).checked;
    for (var a in placesRouteData.routes) placesRouteData.routes[a].data.group_id == e && (placesGroupData.groups[e].route_visible = t, placesRouteData.routes[a].visible = t, placesSetListCheckbox("route_visible_" + a, t), placesRouteVisible(a, t))
}

function placesRouteVisibleAllToggle() {
    placesRouteVisibleAll(1 == gsValues.map_routes ? !1 : !0)
}

function placesRouteVisibleAll(e) {
    if (gsValues.map_routes = e, 1 == e) {
        for (var t in placesGroupData.groups) placesGroupData.groups[t].route_visible = !0, placesSetListCheckbox("route_group_visible_" + t, !0);
        for (var t in placesRouteData.routes) placesRouteData.routes[t].visible = !0, placesSetListCheckbox("route_visible_" + t, !0), placesRouteVisible(t, !0)
    } else {
        for (var t in placesGroupData.groups) placesGroupData.groups[t].route_visible = !1, placesSetListCheckbox("route_group_visible_" + t, !1);
        for (var t in placesRouteData.routes) placesRouteData.routes[t].visible = !1, placesSetListCheckbox("route_visible_" + t, !1);
        placesRouteRemoveAllFromMap()
    }
}

function settingsEventPlaySound() {
    var e = document.getElementById("dialog_settings_event_notify_system_sound_file").value;
    new Audio("snd/" + e).play()
}

function settingsEventProperties(e) {
    switch (e) {
        default:
            var t = e;
            settingsEditData.event_id = t, document.getElementById("dialog_settings_event_name").value = settingsEventData[t].name, document.getElementById("dialog_settings_event_type").value = settingsEventData[t].type, $("#dialog_settings_event_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_active").checked = strToBoolean(settingsEventData[t].active), document.getElementById("dialog_settings_event_duration_from_last_event").checked = strToBoolean(settingsEventData[t].duration_from_last_event), document.getElementById("dialog_settings_event_duration_from_last_event_minutes").value = settingsEventData[t].duration_from_last_event_minutes;
            u = settingsEventData[t].week_days.split(",");
            document.getElementById("dialog_settings_event_wd_sun").checked = strToBoolean(u[0]), document.getElementById("dialog_settings_event_wd_mon").checked = strToBoolean(u[1]), document.getElementById("dialog_settings_event_wd_tue").checked = strToBoolean(u[2]), document.getElementById("dialog_settings_event_wd_wed").checked = strToBoolean(u[3]), document.getElementById("dialog_settings_event_wd_thu").checked = strToBoolean(u[4]), document.getElementById("dialog_settings_event_wd_fri").checked = strToBoolean(u[5]), document.getElementById("dialog_settings_event_wd_sat").checked = strToBoolean(u[6]), null != (p = settingsEventData[t].day_time) ? (document.getElementById("dialog_settings_event_dt").checked = p.dt, document.getElementById("dialog_settings_event_dt_mon").checked = p.mon, document.getElementById("dialog_settings_event_dt_mon_from").value = p.mon_from, $("#dialog_settings_event_dt_mon_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_mon_to").value = p.mon_to, $("#dialog_settings_event_dt_mon_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue").checked = p.tue, document.getElementById("dialog_settings_event_dt_tue_from").value = p.tue_from, $("#dialog_settings_event_dt_tue_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue_to").value = p.tue_to, $("#dialog_settings_event_dt_tue_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed").checked = p.wed, document.getElementById("dialog_settings_event_dt_wed_from").value = p.wed_from, $("#dialog_settings_event_dt_wed_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed_to").value = p.wed_to, $("#dialog_settings_event_dt_wed_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu").checked = p.thu, document.getElementById("dialog_settings_event_dt_thu_from").value = p.thu_from, $("#dialog_settings_event_dt_thu_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu_to").value = p.thu_to, $("#dialog_settings_event_dt_thu_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri").checked = p.fri, document.getElementById("dialog_settings_event_dt_fri_from").value = p.fri_from, $("#dialog_settings_event_dt_fri_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri_to").value = p.fri_to, $("#dialog_settings_event_dt_fri_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat").checked = p.sat, document.getElementById("dialog_settings_event_dt_sat_from").value = p.sat_from, $("#dialog_settings_event_dt_sat_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat_to").value = p.sat_to, $("#dialog_settings_event_dt_sat_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun").checked = p.sun, document.getElementById("dialog_settings_event_dt_sun_from").value = p.sun_from, $("#dialog_settings_event_dt_sun_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun_to").value = p.sun_to, $("#dialog_settings_event_dt_sun_to").multipleSelect("refresh")) : settingsEventResetDayTime(), settingsEventSwitchDayTime();
            var a = document.getElementById("dialog_settings_event_objects"),
                o = settingsEventData[t].imei.split(",");
            if (multiselectSetValues(a, o), $("#dialog_settings_event_objects").multipleSelect("refresh"), "connno" == settingsEventData[t].type || "gpsno" == settingsEventData[t].type || "stopped" == settingsEventData[t].type || "moving" == settingsEventData[t].type || "engidle" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_time_period").enable = !1, document.getElementById("dialog_settings_event_time_period").value = settingsEventData[t].checked_value) : (document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_time_period").value = ""), "overspeed" == settingsEventData[t].type || "overspeedT" == settingsEventData[t].type || "underspeed" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_speed_limit").enable = !1, document.getElementById("dialog_settings_event_speed_limit").value = settingsEventData[t].checked_value) : (document.getElementById("dialog_settings_event_speed_limit").enable = !0, document.getElementById("dialog_settings_event_speed_limit").value = ""), "param" == settingsEventData[t].type || "sensor" == settingsEventData[t].type ? ($("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !1, "param" == settingsEventData[t].type ? settingsEventParamList() : "sensor" == settingsEventData[t].type && settingsEventSensorList(), settingsEditData.event_condition = settingsEventData[t].checked_value.slice(0), settingsEventConditionList()) : ($("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                    message: ""
                }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, settingsEditData.event_condition = [], $("#settings_event_param_sensor_condition_list_grid").clearGridData(!0)), "zone_in" != settingsEventData[t].type && "zone_out" != settingsEventData[t].type) {
                "route_in" == settingsEventData[t].type || "route_out" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_route_trigger").value = "off", $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").enable = !0) : (document.getElementById("dialog_settings_event_route_trigger").value = settingsEventData[t].route_trigger, $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").enable = !1), document.getElementById("dialog_settings_event_routes").enable = !1;
                var i = document.getElementById("dialog_settings_event_routes"),
                    s = settingsEventData[t].routes.split(",");
                multiselectSetValues(i, s), $("#dialog_settings_event_routes").multipleSelect("refresh")
            } else document.getElementById("dialog_settings_event_route_trigger").value = "off", $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").enable = !0, document.getElementById("dialog_settings_event_routes").enable = !0, $("#dialog_settings_event_routes option:selected").removeAttr("selected"), $("#dialog_settings_event_routes").multipleSelect("refresh");
            if ("route_in" != settingsEventData[t].type && "route_out" != settingsEventData[t].type) {
                "zone_in" == settingsEventData[t].type || "zone_out" == settingsEventData[t].type ? (document.getElementById("dialog_settings_event_zone_trigger").value = "off", $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").enable = !0) : (document.getElementById("dialog_settings_event_zone_trigger").value = settingsEventData[t].zone_trigger, $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").enable = !1), document.getElementById("dialog_settings_event_zones").enable = !1;
                var n = document.getElementById("dialog_settings_event_zones"),
                    l = settingsEventData[t].zones.split(",");
                multiselectSetValues(n, l), $("#dialog_settings_event_zones").multipleSelect("refresh")
            } else document.getElementById("dialog_settings_event_zone_trigger").value = "off", $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").enable = !0, document.getElementById("dialog_settings_event_zones").enable = !0, $("#dialog_settings_event_zones").multipleSelect("refresh"), $("#dialog_settings_event_zones option:selected").removeAttr("selected");
            var r = settingsEventData[t].notify_system.split(",");
            document.getElementById("dialog_settings_event_notify_system").checked = strToBoolean(r[0]), document.getElementById("dialog_settings_event_notify_system_hide").checked = strToBoolean(r[1]), document.getElementById("dialog_settings_event_notify_system_sound").checked = strToBoolean(r[2]), void 0 != r[3] && (document.getElementById("dialog_settings_event_notify_system_sound_file").value = r[3], $("#dialog_settings_event_notify_system_sound_file").multipleSelect("refresh")), document.getElementById("dialog_settings_event_notify_email").checked = strToBoolean(settingsEventData[t].notify_email), document.getElementById("dialog_settings_event_notify_email_address").value = settingsEventData[t].notify_email_address, document.getElementById("dialog_settings_event_notify_sms").checked = strToBoolean(settingsEventData[t].notify_sms), document.getElementById("dialog_settings_event_notify_sms_number").value = settingsEventData[t].notify_sms_number, document.getElementById("dialog_settings_event_notify_email_template").value = settingsEventData[t].email_template_id, $("#dialog_settings_event_notify_email_template").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_sms_template").value = settingsEventData[t].sms_template_id, $("#dialog_settings_event_notify_sms_template").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_arrow").checked = strToBoolean(settingsEventData[t].notify_arrow), document.getElementById("dialog_settings_event_notify_arrow_color").value = settingsEventData[t].notify_arrow_color, $("#dialog_settings_event_notify_arrow_color").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_ohc").checked = strToBoolean(settingsEventData[t].notify_ohc), document.getElementById("dialog_settings_event_notify_ohc_color").value = settingsEventData[t].notify_ohc_color, document.getElementById("dialog_settings_event_notify_ohc_color").value = settingsEventData[t].notify_ohc_color.substr(1), document.getElementById("dialog_settings_event_notify_ohc_color").style.backgroundColor = settingsEventData[t].notify_ohc_color, document.getElementById("dialog_settings_event_cmd_send").checked = strToBoolean(settingsEventData[t].cmd_send), document.getElementById("dialog_settings_event_cmd_gateway").value = settingsEventData[t].cmd_gateway, $("#dialog_settings_event_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_type").value = settingsEventData[t].cmd_type, $("#dialog_settings_event_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_string").value = settingsEventData[t].cmd_string, $("#dialog_settings_event_properties").dialog("open");
            break;
        case "add":
            settingsEditData.event_id = !1, document.getElementById("dialog_settings_event_name").value = "", document.getElementById("dialog_settings_event_type").value = "sos", $("#dialog_settings_event_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_active").checked = !0, document.getElementById("dialog_settings_event_duration_from_last_event").checked = !1, document.getElementById("dialog_settings_event_duration_from_last_event_minutes").value = 0, document.getElementById("dialog_settings_event_wd_mon").checked = !0, document.getElementById("dialog_settings_event_wd_tue").checked = !0, document.getElementById("dialog_settings_event_wd_wed").checked = !0, document.getElementById("dialog_settings_event_wd_thu").checked = !0, document.getElementById("dialog_settings_event_wd_fri").checked = !0, document.getElementById("dialog_settings_event_wd_sat").checked = !0, document.getElementById("dialog_settings_event_wd_sun").checked = !0, $("#dialog_settings_event_objects option:selected").removeAttr("selected"), $("#dialog_settings_event_objects").multipleSelect("refresh"), document.getElementById("dialog_settings_event_time_period").value = "", document.getElementById("dialog_settings_event_speed_limit").value = "", document.getElementById("dialog_settings_event_param_sensor_condition_src").value = "", $("#dialog_settings_event_param_sensor_condition_src").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_cn").value = "", $("#dialog_settings_event_param_sensor_condition_cn").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_val").value = "", document.getElementById("dialog_settings_event_notify_system").checked = !1, document.getElementById("dialog_settings_event_notify_system_hide").checked = !1, document.getElementById("dialog_settings_event_notify_system_sound").checked = !1, document.getElementById("dialog_settings_event_notify_email").checked = !1, document.getElementById("dialog_settings_event_notify_email_address").value = "", document.getElementById("dialog_settings_event_notify_sms").checked = !1, document.getElementById("dialog_settings_event_notify_sms_number").value = "", document.getElementById("dialog_settings_event_notify_email_template").value = 0, document.getElementById("dialog_settings_event_notify_sms_template").value = 0, document.getElementById("dialog_settings_event_notify_arrow").checked = !1, document.getElementById("dialog_settings_event_notify_arrow_color").value = "arrow_yellow", $("#dialog_settings_event_notify_arrow_color").multipleSelect("refresh"), document.getElementById("dialog_settings_event_notify_ohc").checked = !1, document.getElementById("dialog_settings_event_notify_ohc_color").value = "FFFF00", document.getElementById("dialog_settings_event_notify_ohc_color").style.backgroundColor = "#FFFF00", document.getElementById("dialog_settings_event_cmd_send").checked = !1, document.getElementById("dialog_settings_event_cmd_gateway").value = "gprs", $("#dialog_settings_event_cmd_gateway").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_type").value = "ascii", $("#dialog_settings_event_cmd_type").multipleSelect("refresh"), document.getElementById("dialog_settings_event_cmd_string").value = "", settingsEventSwitchType(), settingsEventResetDayTime(), settingsEventSwitchDayTime(), $("#dialog_settings_event_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_event_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var d = document.getElementById("dialog_settings_event_type").value,
                _ = document.getElementById("dialog_settings_event_name").value,
                c = document.getElementById("dialog_settings_event_active").checked,
                g = document.getElementById("dialog_settings_event_duration_from_last_event").checked,
                m = document.getElementById("dialog_settings_event_duration_from_last_event_minutes").value,
                u = String(document.getElementById("dialog_settings_event_wd_sun").checked) + ",";
            u += String(document.getElementById("dialog_settings_event_wd_mon").checked) + ",", u += String(document.getElementById("dialog_settings_event_wd_tue").checked) + ",", u += String(document.getElementById("dialog_settings_event_wd_wed").checked) + ",", u += String(document.getElementById("dialog_settings_event_wd_thu").checked) + ",", u += String(document.getElementById("dialog_settings_event_wd_fri").checked) + ",", u += String(document.getElementById("dialog_settings_event_wd_sat").checked);
            var p = {
                dt: document.getElementById("dialog_settings_event_dt").checked,
                mon: document.getElementById("dialog_settings_event_dt_mon").checked,
                mon_from: document.getElementById("dialog_settings_event_dt_mon_from").value,
                mon_to: document.getElementById("dialog_settings_event_dt_mon_to").value,
                tue: document.getElementById("dialog_settings_event_dt_tue").checked,
                tue_from: document.getElementById("dialog_settings_event_dt_tue_from").value,
                tue_to: document.getElementById("dialog_settings_event_dt_tue_to").value,
                wed: document.getElementById("dialog_settings_event_dt_wed").checked,
                wed_from: document.getElementById("dialog_settings_event_dt_wed_from").value,
                wed_to: document.getElementById("dialog_settings_event_dt_wed_to").value,
                thu: document.getElementById("dialog_settings_event_dt_thu").checked,
                thu_from: document.getElementById("dialog_settings_event_dt_thu_from").value,
                thu_to: document.getElementById("dialog_settings_event_dt_thu_to").value,
                fri: document.getElementById("dialog_settings_event_dt_fri").checked,
                fri_from: document.getElementById("dialog_settings_event_dt_fri_from").value,
                fri_to: document.getElementById("dialog_settings_event_dt_fri_to").value,
                sat: document.getElementById("dialog_settings_event_dt_sat").checked,
                sat_from: document.getElementById("dialog_settings_event_dt_sat_from").value,
                sat_to: document.getElementById("dialog_settings_event_dt_sat_to").value,
                sun: document.getElementById("dialog_settings_event_dt_sun").checked,
                sun_from: document.getElementById("dialog_settings_event_dt_sun_from").value,
                sun_to: document.getElementById("dialog_settings_event_dt_sun_to").value
            };
            if (p = JSON.stringify(p), "" == _) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            a = document.getElementById("dialog_settings_event_objects");
            if (!multiselectIsSelected(a)) {
                notifyBox("error", la.ERROR, la.AT_LEAST_ONE_OBJECT_SELECTED);
                break
            }
            if (imei = multiselectGetValues(a), "sos" == d || "bracon" == d || "bracoff" == d || "mandown" == d || "shock" == d || "tow" == d || "pwrcut" == d || "gpsantcut" == d || "jamming" == d || "lowdc" == d || "lowbat" == d || "connyes" == d || "gpsyes" == d || "haccel" == d || "hbrake" == d || "hcorn" == d || "service" == d || "dtc" == d || "route_in" == d || "route_out" == d || "zone_in" == d || "zone_out" == d) v = "";
            if ("connno" == d) {
                if ("" == (v = document.getElementById("dialog_settings_event_time_period").value)) {
                    notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                    break
                }
                v < 5 && (v = 5)
            }
            if ("gpsno" == d) {
                if ("" == (v = document.getElementById("dialog_settings_event_time_period").value)) {
                    notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                    break
                }
                v < 5 && (v = 5)
            }
            if ("stopped" == d || "moving" == d || "engidle" == d) {
                if ("" == (v = document.getElementById("dialog_settings_event_time_period").value)) {
                    notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                    break
                }
                v < 1 && (v = 1)
            }
            if (("overspeed" == d || "overspeedT"== d || "underspeed" == d) && "" == (v = document.getElementById("dialog_settings_event_speed_limit").value)) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if ("param" == d || "sensor" == d) {
                var y = settingsEditData.event_condition;
                if (0 == y.length) {
                    notifyBox("error", la.ERROR, la.AT_LEAST_ONE_CONDITION);
                    break
                }
                var v = JSON.stringify(y)
            }
            var b = "",
                i = "";
            if ("route_in" != d || "route_out" != d) {
                var E = document.getElementById("dialog_settings_event_routes");
                if ("route_in" == d || "route_out" == d) {
                    if (b = "off", !multiselectIsSelected(E)) {
                        notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ROUTE_SELECTED);
                        break
                    }
                } else b = document.getElementById("dialog_settings_event_route_trigger").value;
                i = multiselectGetValues(E)
            }
            var h = "",
                n = "";
            if ("route_in" != d && "route_out" != d) {
                var f = document.getElementById("dialog_settings_event_zones");
                if ("zone_in" == d || "zone_out" == d) {
                    if (h = "off", !multiselectIsSelected(f)) {
                        notifyBox("error", la.ERROR, la.AT_LEAST_ONE_ZONE_SELECTED);
                        break
                    }
                } else h = document.getElementById("dialog_settings_event_zone_trigger").value;
                n = multiselectGetValues(f)
            }
            r = (r = document.getElementById("dialog_settings_event_notify_system").checked) + "," + document.getElementById("dialog_settings_event_notify_system_hide").checked + "," + document.getElementById("dialog_settings_event_notify_system_sound").checked + "," + document.getElementById("dialog_settings_event_notify_system_sound_file").value;
            var I = document.getElementById("dialog_settings_event_notify_email").checked,
                D = document.getElementById("dialog_settings_event_notify_email_address").value;
            if (1 == I)
                for (var B = D.split(","), O = 0; O < B.length; O++)
                    if (B[O] = B[O].trim(), !isEmailValid(B[O])) return notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID), !1;
            var j = document.getElementById("dialog_settings_event_notify_sms").checked,
                R = document.getElementById("dialog_settings_event_notify_sms_number").value,
                T = document.getElementById("dialog_settings_event_notify_email_template").value,
                k = document.getElementById("dialog_settings_event_notify_sms_template").value,
                S = document.getElementById("dialog_settings_event_notify_arrow").checked,
                w = document.getElementById("dialog_settings_event_notify_arrow_color").value,
                L = document.getElementById("dialog_settings_event_notify_ohc").checked,
                A = "#" + document.getElementById("dialog_settings_event_notify_ohc_color").value,
                N = document.getElementById("dialog_settings_event_cmd_send").checked,
                x = document.getElementById("dialog_settings_event_cmd_gateway").value,
                M = document.getElementById("dialog_settings_event_cmd_type").value,
                C = document.getElementById("dialog_settings_event_cmd_string").value;
            if (1 == N) {
                if ("" == C) return notifyBox("error", la.ERROR, la.COMMAND_CANT_BE_EMPTY, !0), !1;
                if ("hex" == M && (C = C.toUpperCase(), !isHexValid(C.replace("%IMEI%", "")))) return notifyBox("error", la.ERROR, la.COMMAND_HEX_NOT_VALID, !0), !1
            }
            var P = {
                cmd: "save_event",
                event_id: settingsEditData.event_id,
                type: d,
                name: _,
                active: c,
                duration_from_last_event: g,
                duration_from_last_event_minutes: m,
                week_days: u,
                day_time: p,
                imei: imei,
                checked_value: v,
                route_trigger: b,
                zone_trigger: h,
                routes: i,
                zones: n,
                notify_system: r,
                notify_email: I,
                notify_email_address: D,
                notify_sms: j,
                notify_sms_number: R,
                email_template_id: T,
                sms_template_id: k,
                notify_arrow: S,
                notify_arrow_color: w,
                notify_ohc: L,
                notify_ohc_color: A,
                cmd_send: N,
                cmd_gateway: x,
                cmd_type: M,
                cmd_string: C
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.events.php",
                data: P,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadEvents(), $("#dialog_settings_event_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsEventDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_event",
                event_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.events.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadEvents()
                }
            })
        }
    })
}

function settingsEventDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#settings_main_events_event_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_events",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.events.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadEvents()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsEventConditionList() {
    var e = settingsEditData.event_condition,
        t = [],
        a = $("#settings_event_param_sensor_condition_list_grid");
    if (a.clearGridData(!0), 0 != e.length) {
        for (i = 0; i < e.length; i++) {
            var o = '<a href="#" onclick="settingsEventConditionDel(' + i + ');" title="' + la.DELETE + '"><img src="theme/images/remove3.svg" /></a>';
            t.push({
                src: e[i].src,
                cn: e[i].cn,
                val: e[i].val,
                modify: o
            })
        }
        for (var i = 0; i < t.length; i++) a.jqGrid("addRowData", i, t[i]);
        a.setGridParam({
            sortname: "src",
            sortorder: "asc"
        }).trigger("reloadGrid")
    }
}

function settingsEventConditionAdd() {
    var e = document.getElementById("dialog_settings_event_param_sensor_condition_src").value,
        t = document.getElementById("dialog_settings_event_param_sensor_condition_cn").value,
        a = document.getElementById("dialog_settings_event_param_sensor_condition_val").value;
    if ("" != e && "" != t && "" != a) {
        for (var o = 0; o < settingsEditData.event_condition.length; o++)
            if (settingsEditData.event_condition[o].src == e) return void notifyBox("error", la.ERROR, la.SAME_SOURCE_ITEM_AVAILABLE);
        settingsEditData.event_condition.push({
            src: e,
            cn: t,
            val: a
        }), document.getElementById("dialog_settings_event_param_sensor_condition_src").value = "", $("#dialog_settings_event_param_sensor_condition_src").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_cn").value = "", $("#dialog_settings_event_param_sensor_condition_cn").multipleSelect("refresh"), document.getElementById("dialog_settings_event_param_sensor_condition_val").value = "", settingsEventConditionList()
    } else notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT)
}

function settingsEventConditionDel(e) {
    settingsEditData.event_condition.splice(e, 1), settingsEventConditionList()
}

function settingsEventParamList() {
    var e = document.getElementById("dialog_settings_event_param_sensor_condition_src");
    e.options.length = 0, e.options.add(new Option("", "")), e.options.add(new Option(la.SPEED.toLowerCase(), "speed"));
    for (var t = getAllParamsArray(), a = 0; a < t.length; a++) e.options.add(new Option(t[a], t[a]));
    sortSelectList(e)
}

function settingsEventSensorList() {
    var e = document.getElementById("dialog_settings_event_param_sensor_condition_src");
    e.options.length = 0;
    var t = getAllSensorsArray();
    e.options.add(new Option("", "")), e.options.add(new Option(la.SPEED, "speed"));
    for (var a = 0; a < t.length; a++) e.options.add(new Option(t[a], t[a]));
    sortSelectList(e)
}

function settingsEventSwitchType() {
    switch (document.getElementById("dialog_settings_event_time_period").value = "", document.getElementById("dialog_settings_event_speed_limit").value = "", $("#dialog_settings_event_routes option:selected").removeAttr("selected"), $("#dialog_settings_event_routes").multipleSelect("refresh"), $("#dialog_settings_event_zones option:selected").removeAttr("selected"), $("#dialog_settings_event_zones").multipleSelect("refresh"), document.getElementById("dialog_settings_event_route_trigger").value = "off", $("#dialog_settings_event_route_trigger").multipleSelect("refresh"), document.getElementById("dialog_settings_event_zone_trigger").value = "off", $("#dialog_settings_event_zone_trigger").multipleSelect("refresh"), settingsEditData.event_condition = [], $("#settings_event_param_sensor_condition_list_grid").clearGridData(!0), document.getElementById("dialog_settings_event_type").value) {
        case "sos":
        case "bracon":
        case "bracoff":
        case "mandown":
        case "shock":
        case "tow":
        case "pwrcut":
        case "gpsantcut":
        case "jamming":
        case "lowdc":
        case "lowbat":
        case "connyes":
        case "gpsyes":
        case "haccel":
        case "hbrake":
        case "hcorn":
        case "service":
        case "dtc":
            document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_speed_limit").enable = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, document.getElementById("dialog_settings_event_route_trigger").enable = !1, document.getElementById("dialog_settings_event_zone_trigger").enable = !1, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !1;
            break;
        case "connno":
        case "gpsno":
            document.getElementById("dialog_settings_event_time_period").enable = !1, document.getElementById("dialog_settings_event_speed_limit").enable = !0, "" == document.getElementById("dialog_settings_event_time_period").value && (document.getElementById("dialog_settings_event_time_period").value = 60), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, document.getElementById("dialog_settings_event_route_trigger").enable = !1, document.getElementById("dialog_settings_event_zone_trigger").enable = !1, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !1;
            break;
        case "stopped":
        case "moving":
        case "engidle":
            document.getElementById("dialog_settings_event_time_period").enable = !1, document.getElementById("dialog_settings_event_speed_limit").enable = !0, "" == document.getElementById("dialog_settings_event_time_period").value && (document.getElementById("dialog_settings_event_time_period").value = 5), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, document.getElementById("dialog_settings_event_route_trigger").enable = !1, document.getElementById("dialog_settings_event_zone_trigger").enable = !1, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !1;
            break;
        case "overspeed":
        case "underspeed":
            document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_speed_limit").enable = !1, "" == document.getElementById("dialog_settings_event_speed_limit").value && (document.getElementById("dialog_settings_event_speed_limit").value = 60), $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, document.getElementById("dialog_settings_event_route_trigger").enable = !1, document.getElementById("dialog_settings_event_zone_trigger").enable = !1, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !1;
            break;
        case "param":
            document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_speed_limit").enable = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !1, settingsEventParamList(), document.getElementById("dialog_settings_event_route_trigger").enable = !1, document.getElementById("dialog_settings_event_zone_trigger").enable = !1, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !1;
            break;
        case "sensor":
            document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_speed_limit").enable = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !1, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !1, settingsEventSensorList(), document.getElementById("dialog_settings_event_route_trigger").enable = !1, document.getElementById("dialog_settings_event_zone_trigger").enable = !1, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !1;
            break;
        case "route_in":
        case "route_out":
            document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_speed_limit").enable = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, document.getElementById("dialog_settings_event_route_trigger").enable = !0, document.getElementById("dialog_settings_event_zone_trigger").enable = !0, document.getElementById("dialog_settings_event_routes").enable = !1, document.getElementById("dialog_settings_event_zones").enable = !0;
            break;
        case "zone_in":
        case "zone_out":
            document.getElementById("dialog_settings_event_time_period").enable = !0, document.getElementById("dialog_settings_event_speed_limit").enable = !0, $("#settings_event_param_sensor_condition_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("dialog_settings_event_param_sensor_condition_src").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_cn").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_val").enable = !0, document.getElementById("dialog_settings_event_param_sensor_condition_add").enable = !0, document.getElementById("dialog_settings_event_route_trigger").enable = !0, document.getElementById("dialog_settings_event_zone_trigger").enable = !0, document.getElementById("dialog_settings_event_routes").enable = !0, document.getElementById("dialog_settings_event_zones").enable = !1
    }
}

function settingsEventResetDayTime() {
    document.getElementById("dialog_settings_event_dt").checked = !1, document.getElementById("dialog_settings_event_dt_mon").checked = !1, document.getElementById("dialog_settings_event_dt_mon_from").value = "00:00", $("#dialog_settings_event_dt_mon_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_mon_to").value = "24:00", $("#dialog_settings_event_dt_mon_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue").checked = !1, document.getElementById("dialog_settings_event_dt_tue_from").value = "00:00", $("#dialog_settings_event_dt_tue_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_tue_to").value = "24:00", $("#dialog_settings_event_dt_tue_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed").checked = !1, document.getElementById("dialog_settings_event_dt_wed_from").value = "00:00", $("#dialog_settings_event_dt_wed_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_wed_to").value = "24:00", $("#dialog_settings_event_dt_wed_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu").checked = !1, document.getElementById("dialog_settings_event_dt_thu_from").value = "00:00", $("#dialog_settings_event_dt_thu_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_thu_to").value = "24:00", $("#dialog_settings_event_dt_thu_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri").checked = !1, document.getElementById("dialog_settings_event_dt_fri_from").value = "00:00", $("#dialog_settings_event_dt_fri_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_fri_to").value = "24:00", $("#dialog_settings_event_dt_fri_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat").checked = !1, document.getElementById("dialog_settings_event_dt_sat_from").value = "00:00", $("#dialog_settings_event_dt_sat_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sat_to").value = "24:00", $("#dialog_settings_event_dt_sat_to").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun").checked = !1, document.getElementById("dialog_settings_event_dt_sun_from").value = "00:00", $("#dialog_settings_event_dt_sun_from").multipleSelect("refresh"), document.getElementById("dialog_settings_event_dt_sun_to").value = "24:00", $("#dialog_settings_event_dt_sun_to").multipleSelect("refresh")
}

function settingsEventSwitchDayTime() {
    0 == document.getElementById("dialog_settings_event_dt").checked ? (document.getElementById("dialog_settings_event_dt_mon").enable = !0, document.getElementById("dialog_settings_event_dt_mon_from").enable = !0, document.getElementById("dialog_settings_event_dt_mon_to").enable = !0, document.getElementById("dialog_settings_event_dt_tue").enable = !0, document.getElementById("dialog_settings_event_dt_tue_from").enable = !0, document.getElementById("dialog_settings_event_dt_tue_to").enable = !0, document.getElementById("dialog_settings_event_dt_wed").enable = !0, document.getElementById("dialog_settings_event_dt_wed_from").enable = !0, document.getElementById("dialog_settings_event_dt_wed_to").enable = !0, document.getElementById("dialog_settings_event_dt_thu").enable = !0, document.getElementById("dialog_settings_event_dt_thu_from").enable = !0, document.getElementById("dialog_settings_event_dt_thu_to").enable = !0, document.getElementById("dialog_settings_event_dt_fri").enable = !0, document.getElementById("dialog_settings_event_dt_fri_from").enable = !0, document.getElementById("dialog_settings_event_dt_fri_to").enable = !0, document.getElementById("dialog_settings_event_dt_sat").enable = !0, document.getElementById("dialog_settings_event_dt_sat_from").enable = !0, document.getElementById("dialog_settings_event_dt_sat_to").enable = !0, document.getElementById("dialog_settings_event_dt_sun").enable = !0, document.getElementById("dialog_settings_event_dt_sun_from").enable = !0, document.getElementById("dialog_settings_event_dt_sun_to").enable = !0) : (document.getElementById("dialog_settings_event_dt_mon").enable = !1, document.getElementById("dialog_settings_event_dt_mon_from").enable = !1, document.getElementById("dialog_settings_event_dt_mon_to").enable = !1, document.getElementById("dialog_settings_event_dt_tue").enable = !1, document.getElementById("dialog_settings_event_dt_tue_from").enable = !1, document.getElementById("dialog_settings_event_dt_tue_to").enable = !1, document.getElementById("dialog_settings_event_dt_wed").enable = !1, document.getElementById("dialog_settings_event_dt_wed_from").enable = !1, document.getElementById("dialog_settings_event_dt_wed_to").enable = !1, document.getElementById("dialog_settings_event_dt_thu").enable = !1, document.getElementById("dialog_settings_event_dt_thu_from").enable = !1, document.getElementById("dialog_settings_event_dt_thu_to").enable = !1, document.getElementById("dialog_settings_event_dt_fri").enable = !1, document.getElementById("dialog_settings_event_dt_fri_from").enable = !1, document.getElementById("dialog_settings_event_dt_fri_to").enable = !1, document.getElementById("dialog_settings_event_dt_sat").enable = !1, document.getElementById("dialog_settings_event_dt_sat_from").enable = !1, document.getElementById("dialog_settings_event_dt_sat_to").enable = !1, document.getElementById("dialog_settings_event_dt_sun").enable = !1, document.getElementById("dialog_settings_event_dt_sun_from").enable = !1, document.getElementById("dialog_settings_event_dt_sun_to").enable = !1)
}

function settingsObjectGroupImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectGroupImportOGRFile, !1), document.getElementById("load_file").click())
}

function settingsObjectGroupExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=ogr";
        window.location = e
    }
}

function settingsObjectGroupImportOGRFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.ogr) {
                var a = t.groups.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.GROUPS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "ogr",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && settingsReloadObjectGroups()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectGroupImportOGRFile, !1)
}

function settingsObjectGroupDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_object_group",
                group_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.groups.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadObjectGroups()
                }
            })
        }
    })
}

function settingsObjectGroupDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#settings_main_object_group_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_object_groups",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.groups.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadObjectGroups()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectGroupProperties(e) {
    switch (e) {
        default:
            var t = e;
            settingsEditData.group_id = t, document.getElementById("dialog_settings_object_group_name").value = settingsObjectGroupData[t].name, document.getElementById("dialog_settings_object_group_desc").value = settingsObjectGroupData[t].desc;
            var a = document.getElementById("dialog_settings_object_group_objects"),
                o = new Array;
            for (var i in settingsObjectData) settingsObjectData[i].group_id == t && o.push(i);
            multiselectSetValues(a, o), $("#dialog_settings_object_group_objects").multipleSelect("refresh"), $("#dialog_settings_object_group_properties").dialog("open");
            break;
        case "add":
            settingsEditData.group_id = !1, document.getElementById("dialog_settings_object_group_name").value = "", document.getElementById("dialog_settings_object_group_desc").value = "", $("#dialog_settings_object_group_objects option:selected").removeAttr("selected"), $("#dialog_settings_object_group_objects").multipleSelect("refresh"), $("#dialog_settings_object_group_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_group_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var s = document.getElementById("dialog_settings_object_group_name").value,
                n = document.getElementById("dialog_settings_object_group_desc").value,
                l = multiselectGetValues(document.getElementById("dialog_settings_object_group_objects"));
            if ("" == s) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            for (var i in settingsObjectData) settingsObjectData[i].group_id == settingsEditData.group_id && (settingsObjectData[i].group_id = 0);
            var r = l.split(",");
            for (var i in settingsObjectData)
                for (var d = 0; d < r.length; d++) i == r[d] && (settingsObjectData[i].group_id = settingsEditData.group_id);
            var _ = {
                cmd: "save_object_group",
                group_id: settingsEditData.group_id,
                group_name: s,
                group_desc: n,
                group_imei: l
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.groups.php",
                data: _,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjectGroups(), $("#dialog_settings_object_group_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsObjectDriverImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectDriverImportODRFile, !1), document.getElementById("load_file").click())
}

function settingsObjectDriverExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=odr";
        window.location = e
    }
}

function settingsObjectDriverImportODRFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.odr) {
                var a = t.drivers.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.DRIVERS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "odr",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && settingsReloadObjectDrivers()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectDriverImportODRFile, !1)
}

function settingsObjectDriverDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_object_driver",
                driver_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.drivers.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadObjectDrivers()
                }
            })
        }
    })
}

function settingsObjectDriverDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#settings_main_object_driver_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_object_drivers",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.drivers.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadObjectDrivers()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectDriverProperties(e) {
    switch (e) {
        default:
            var t = e;
            settingsEditData.driver_id = t, settingsEditData.driver_img_file = !1;
            var a = document.getElementById("dialog_settings_object_driver_photo");
            "" == settingsObjectDriverData[t].img ? a.src = "img/user-blank.svg" : a.src = "data/user/drivers/" + settingsObjectDriverData[t].img, document.getElementById("dialog_settings_object_driver_name").value = settingsObjectDriverData[t].name, document.getElementById("dialog_settings_object_driver_assign_id").value = settingsObjectDriverData[t].assign_id, document.getElementById("dialog_settings_object_driver_idn").value = settingsObjectDriverData[t].idn, document.getElementById("dialog_settings_object_driver_address").value = settingsObjectDriverData[t].address, document.getElementById("dialog_settings_object_driver_phone").value = settingsObjectDriverData[t].phone, document.getElementById("dialog_settings_object_driver_email").value = settingsObjectDriverData[t].email, document.getElementById("dialog_settings_object_driver_desc").value = settingsObjectDriverData[t].desc, $("#dialog_settings_object_driver_properties").dialog("open");
            break;
        case "add":
            settingsEditData.driver_id = !1, settingsEditData.driver_img_file = !1, (a = document.getElementById("dialog_settings_object_driver_photo")).src = "img/user-blank.svg", document.getElementById("dialog_settings_object_driver_name").value = "", document.getElementById("dialog_settings_object_driver_assign_id").value = "", document.getElementById("dialog_settings_object_driver_idn").value = "", document.getElementById("dialog_settings_object_driver_address").value = "", document.getElementById("dialog_settings_object_driver_phone").value = "", document.getElementById("dialog_settings_object_driver_email").value = "", document.getElementById("dialog_settings_object_driver_desc").value = "", $("#dialog_settings_object_driver_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_driver_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var o = document.getElementById("dialog_settings_object_driver_name").value,
                i = document.getElementById("dialog_settings_object_driver_assign_id").value,
                s = document.getElementById("dialog_settings_object_driver_idn").value,
                n = document.getElementById("dialog_settings_object_driver_address").value,
                l = document.getElementById("dialog_settings_object_driver_phone").value,
                r = document.getElementById("dialog_settings_object_driver_email").value,
                d = document.getElementById("dialog_settings_object_driver_desc").value;
            if ("" == o) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            var _ = {
                cmd: "save_object_driver",
                driver_id: settingsEditData.driver_id,
                driver_name: o,
                driver_assign_id: i,
                driver_idn: s,
                driver_address: n,
                driver_phone: l,
                driver_email: r,
                driver_desc: d,
                driver_img_file: settingsEditData.driver_img_file
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.drivers.php",
                data: _,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjectDrivers(), $("#dialog_settings_object_driver_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsObjectDriverPhotoDelete() {
    utilsCheckPrivileges("viewer") && (settingsEditData.driver_img_file = "delete", document.getElementById("dialog_settings_object_driver_photo").src = "img/user-blank.svg")
}

function settingsObjectDriverPhotoUpload() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectDriverPhotoUploadFile, !1), document.getElementById("load_file").click())
}

function settingsObjectDriverPhotoUploadFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onloadend = function(e) {
        var a = e.target.result;
        if (t[0].type.match("image/png") || t[0].type.match("image/jpeg")) {
            var o = new Image;
            o.src = a, o.onload = function() {
                o.width > 640 || o.height > 480 ? notifyBox("error", la.ERROR, la.IMAGE_SIZE_SHOULD_NOT_BE_BIGGER_THAN_640_480) : $.ajax({
                    url: "func/fn_upload.php?file=driver_photo",
                    type: "POST",
                    data: a,
                    processData: !1,
                    contentType: !1,
                    success: function(e) {
                        document.getElementById("dialog_settings_object_driver_photo").src = e + "?t=" + (new Date).getTime(), settingsEditData.driver_img_file = !0
                    }
                })
            }, document.getElementById("load_file").value = ""
        } else notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_PNG_OR_JPG)
    }, a.readAsDataURL(t[0]), this.removeEventListener("change", settingsObjectDriverPhotoUploadFile, !1)
}

function settingsObjectPassengerImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectPassengerImportOPAFile, !1), document.getElementById("load_file").click())
}

function settingsObjectPassengerExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=opa";
        window.location = e
    }
}

function settingsObjectPassengerImportOPAFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.opa) {
                var a = t.passengers.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.PASSENGERS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "opa",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && settingsReloadObjectPassengers()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectPassengerImportOPAFile, !1)
}

function settingsObjectPassengerDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_object_passenger",
                passenger_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.passengers.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadObjectPassengers()
                }
            })
        }
    })
}

function settingsObjectPassengerDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#settings_main_object_passenger_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_object_passengers",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.passengers.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadObjectPassengers()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectPassengerProperties(e) {
    switch (e) {
        default:
            var t = e,
                a = {
                    cmd: "load_object_passenger_data",
                    passenger_id: t
                };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.passengers.php",
                data: a,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsEditData.passenger_id = t, document.getElementById("dialog_settings_object_passenger_name").value = e.name, document.getElementById("dialog_settings_object_passenger_assign_id").value = e.assign_id, document.getElementById("dialog_settings_object_passenger_idn").value = e.idn, document.getElementById("dialog_settings_object_passenger_address").value = e.address, document.getElementById("dialog_settings_object_passenger_phone").value = e.phone, document.getElementById("dialog_settings_object_passenger_email").value = e.email, document.getElementById("dialog_settings_object_passenger_desc").value = e.desc, $("#dialog_settings_object_passenger_properties").dialog("open")
                }
            });
            break;
        case "add":
            settingsEditData.passenger_id = !1, document.getElementById("dialog_settings_object_passenger_name").value = "", document.getElementById("dialog_settings_object_passenger_assign_id").value = "", document.getElementById("dialog_settings_object_passenger_idn").value = "", document.getElementById("dialog_settings_object_passenger_address").value = "", document.getElementById("dialog_settings_object_passenger_phone").value = "", document.getElementById("dialog_settings_object_passenger_email").value = "", document.getElementById("dialog_settings_object_passenger_desc").value = "", $("#dialog_settings_object_passenger_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_passenger_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var o = document.getElementById("dialog_settings_object_passenger_name").value,
                i = document.getElementById("dialog_settings_object_passenger_assign_id").value,
                s = document.getElementById("dialog_settings_object_passenger_idn").value,
                n = document.getElementById("dialog_settings_object_passenger_address").value,
                l = document.getElementById("dialog_settings_object_passenger_phone").value,
                r = document.getElementById("dialog_settings_object_passenger_email").value,
                d = document.getElementById("dialog_settings_object_passenger_desc").value;
            if ("" == o) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            a = {
                cmd: "save_object_passenger",
                passenger_id: settingsEditData.passenger_id,
                passenger_name: o,
                passenger_assign_id: i,
                passenger_idn: s,
                passenger_address: n,
                passenger_phone: l,
                passenger_email: r,
                passenger_desc: d
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.passengers.php",
                data: a,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjectPassengers(), $("#dialog_settings_object_passenger_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsObjectTrailerImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectTrailerImportOTRFile, !1), document.getElementById("load_file").click())
}

function settingsObjectTrailerExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=otr";
        window.location = e
    }
}

function settingsObjectTrailerImportOTRFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.otr) {
                var a = t.trailers.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.TRAILERS_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "otr",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && settingsReloadObjectTrailers()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectTrailerImportOTRFile, !1)
}

function settingsObjectTrailerDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_object_trailer",
                trailer_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.trailers.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadObjectTrailers()
                }
            })
        }
    })
}

function settingsObjectTrailerDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#settings_main_object_trailer_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_object_trailers",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.trailers.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadObjectTrailers()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectTrailerProperties(e) {
    switch (e) {
        default:
            var t = e;
            settingsEditData.trailer_id = t, document.getElementById("dialog_settings_object_trailer_name").value = settingsObjectTrailerData[t].name, document.getElementById("dialog_settings_object_trailer_assign_id").value = settingsObjectTrailerData[t].assign_id, document.getElementById("dialog_settings_object_trailer_model").value = settingsObjectTrailerData[t].model, document.getElementById("dialog_settings_object_trailer_vin").value = settingsObjectTrailerData[t].vin, document.getElementById("dialog_settings_object_trailer_plate_number").value = settingsObjectTrailerData[t].plate_number, document.getElementById("dialog_settings_object_trailer_desc").value = settingsObjectTrailerData[t].desc, $("#dialog_settings_object_trailer_properties").dialog("open");
            break;
        case "add":
            settingsEditData.trailer_id = !1, document.getElementById("dialog_settings_object_trailer_name").value = "", document.getElementById("dialog_settings_object_trailer_assign_id").value = "", document.getElementById("dialog_settings_object_trailer_model").value = "", document.getElementById("dialog_settings_object_trailer_vin").value = "", document.getElementById("dialog_settings_object_trailer_plate_number").value = "", document.getElementById("dialog_settings_object_trailer_desc").value = "", $("#dialog_settings_object_trailer_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_trailer_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var a = document.getElementById("dialog_settings_object_trailer_name").value,
                o = document.getElementById("dialog_settings_object_trailer_assign_id").value,
                i = document.getElementById("dialog_settings_object_trailer_model").value,
                s = document.getElementById("dialog_settings_object_trailer_vin").value,
                n = document.getElementById("dialog_settings_object_trailer_plate_number").value,
                l = document.getElementById("dialog_settings_object_trailer_desc").value;
            if ("" == a) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            var r = {
                cmd: "save_object_trailer",
                trailer_id: settingsEditData.trailer_id,
                trailer_name: a,
                trailer_assign_id: o,
                trailer_model: i,
                trailer_vin: s,
                trailer_plate_number: n,
                trailer_desc: l
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.trailers.php",
                data: r,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjectTrailers(), $("#dialog_settings_object_trailer_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsOpen() {
    loadSettings("user", function() {
        loadSettings("objects", function() {
            $("#settings_main_object_list_grid").trigger("reloadGrid"), $("#dialog_settings").dialog("open")
        })
    })
}

function settingsClose() {
    loadSettings("objects", function() {
        objectReloadData()
    })
}

function settingsOpenUser() {
    settingsOpen(), document.getElementById("settings_main_my_account_tab").click()
}

function settingsReloadUser() {
    setTimeout(function() {
        window.location.reload()
    }, 2e3)
}

function settingsReloadObjects() {
    loadSettings("objects", function() {
        1 != $("#dialog_settings").dialog("isOpen") && objectReloadData()
    }), $("#settings_main_object_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectGroups() {
    loadSettings("object_groups", function() {}), $("#settings_main_object_group_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectDrivers() {
    loadSettings("object_drivers", function() {}), $("#settings_main_object_driver_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectPassengers() {
    $("#settings_main_object_passenger_list_grid").trigger("reloadGrid")
}

function settingsReloadObjectTrailers() {
    loadSettings("object_trailers", function() {}), $("#settings_main_object_trailer_list_grid").trigger("reloadGrid")
}

function settingsReloadEvents() {
    loadSettings("events", function() {}), $("#settings_main_events_event_list_grid").trigger("reloadGrid")
}

function settingsReloadTemplates() {
    loadSettings("templates", function() {}), $("#settings_main_templates_template_list_grid").trigger("reloadGrid")
}

function settingsReloadSubaccounts() {
    loadSettings("subaccounts", function() {}), $("#settings_main_subaccount_list_grid").trigger("reloadGrid")
}

function settingsCheck() {
    document.getElementById("settings_main_dst").checked ? (document.getElementById("settings_main_dst_start_mmdd").enable = !1, document.getElementById("settings_main_dst_start_hhmm").enable = !1, document.getElementById("settings_main_dst_end_mmdd").enable = !1, document.getElementById("settings_main_dst_end_hhmm").enable = !1) : (document.getElementById("settings_main_dst_start_mmdd").enable = !0, document.getElementById("settings_main_dst_start_hhmm").enable = !0, document.getElementById("settings_main_dst_end_mmdd").enable = !0, document.getElementById("settings_main_dst_end_hhmm").enable = !0)
}

function loadSettings(e, t) {
    switch (e) {
        case "cookies":
            var a = getCookie("gs_dragbars");
            void 0 == a && (a = guiDragbars.objects + ";" + guiDragbars.events + ";" + guiDragbars.history + ";" + guiDragbars.bottom_panel), null != (a = a.split(";"))[0] && "" != a[0] && (guiDragbars.objects = a[0]), null != a[1] && "" != a[1] && (guiDragbars.events = a[1]), null != a[2] && "" != a[2] && (guiDragbars.history = a[2]), null != a[3] && "" != a[3] && (guiDragbars.bottom_panel = a[3]);
            var o = getCookie("gs_map");
            void 0 == o && (o = gsValues.map_lat + ";" + gsValues.map_lng + ";" + gsValues.map_zoom + ";" + gsValues.map_layer + ";", o += gsValues.map_objects + ";" + gsValues.map_object_labels + ";" + gsValues.map_markers + ";" + gsValues.map_routes + ";" + gsValues.map_zones + ";" + gsValues.map_clusters), o = o.split(";"), "last" == settingsUserData.map_sp && (null != o[0] && "" != o[0] && (gsValues.map_lat = o[0]), null != o[1] && "" != o[1] && (gsValues.map_lng = o[1]), null != o[2] && "" != o[2] && (gsValues.map_zoom = o[2])), null != o[3] && "" != o[3] && (gsValues.map_layer = o[3]), null != o[4] && "" != o[4] && (gsValues.map_objects = strToBoolean(o[4])), null != o[5] && "" != o[5] && (gsValues.map_object_labels = strToBoolean(o[5])), null != o[6] && "" != o[6] && (gsValues.map_markers = strToBoolean(o[6])), null != o[7] && "" != o[7] && (gsValues.map_routes = strToBoolean(o[7])), null != o[8] && "" != o[8] && (gsValues.map_zones = strToBoolean(o[8])), null != o[9] && "" != o[9] && (gsValues.map_clusters = strToBoolean(o[9])), t(!0);
            break;
        case "server":
            i = {
                cmd: "load_server_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    gsValues.url_root = e.url_root, gsValues.map_custom = e.map_custom, gsValues.map_osm = strToBoolean(e.map_osm), gsValues.map_bing = strToBoolean(e.map_bing), gsValues.map_google = strToBoolean(e.map_google), gsValues.map_google_street_view = strToBoolean(e.map_google_street_view), gsValues.map_google_traffic = strToBoolean(e.map_google_traffic), gsValues.map_mapbox = strToBoolean(e.map_mapbox), gsValues.map_yandex = strToBoolean(e.map_yandex), gsValues.map_bing_key = e.map_bing_key, gsValues.map_mapbox_key = e.map_mapbox_key, gsValues.map_layer = e.map_layer, gsValues.map_zoom = e.map_zoom, gsValues.map_lat = e.map_lat, gsValues.map_lng = e.map_lng, gsValues.notify_obj_expire = strToBoolean(e.notify_obj_expire), gsValues.notify_obj_expire_period = e.notify_obj_expire_period, gsValues.notify_account_expire = strToBoolean(e.notify_account_expire), gsValues.notify_account_expire_period = e.notify_account_expire_period, t(!0)
                }
            });
            break;
        case "user":
            i = {
                cmd: "load_user_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    "subuser" != (settingsUserData = e).privileges && (document.getElementById("settings_main_sms_gateway").checked = strToBoolean(settingsUserData.sms_gateway), "" == settingsUserData.sms_gateway_type && (settingsUserData.sms_gateway_type = "app"), document.getElementById("settings_main_sms_gateway_type").value = settingsUserData.sms_gateway_type, document.getElementById("settings_main_sms_gateway_url").value = settingsUserData.sms_gateway_url, document.getElementById("settings_main_sms_gateway_identifier").value = settingsUserData.sms_gateway_identifier, document.getElementById("settings_main_sms_gateway_total_in_queue").innerHTML = settingsUserData.sms_gateway_total_in_queue, settingsSMSGatewaySwitchType()), document.getElementById("settings_main_chat_notify_sound_file").value = settingsUserData.chat_notify, document.getElementById("settings_main_map_startup_possition").value = settingsUserData.map_sp, document.getElementById("settings_main_map_icon_size").value = settingsUserData.map_is, document.getElementById("settings_main_history_route_color").value = settingsUserData.map_rc.substr(1), document.getElementById("settings_main_history_route_color").style.backgroundColor = settingsUserData.map_rc, document.getElementById("settings_main_history_route_highlight_color").value = settingsUserData.map_rhc.substr(1), document.getElementById("settings_main_history_route_highlight_color").style.backgroundColor = settingsUserData.map_rhc;
                    settingsUserData.groups_collapsed;
                    document.getElementById("settings_main_groups_collapsed_objects").checked = settingsUserData.groups_collapsed.objects, document.getElementById("settings_main_groups_collapsed_markers").checked = settingsUserData.groups_collapsed.markers, document.getElementById("settings_main_groups_collapsed_routes").checked = settingsUserData.groups_collapsed.routes, document.getElementById("settings_main_groups_collapsed_zones").checked = settingsUserData.groups_collapsed.zones, document.getElementById("settings_main_od").value = settingsUserData.od;
                    settingsUserData.ohc;
                    if (document.getElementById("settings_main_ohc_no_connection").checked = settingsUserData.ohc.no_connection, document.getElementById("settings_main_ohc_no_connection_color").value = settingsUserData.ohc.no_connection_color.substr(1), document.getElementById("settings_main_ohc_no_connection_color").style.backgroundColor = settingsUserData.ohc.no_connection_color, document.getElementById("settings_main_ohc_stopped").checked = settingsUserData.ohc.stopped, document.getElementById("settings_main_ohc_stopped_color").value = settingsUserData.ohc.stopped_color.substr(1), document.getElementById("settings_main_ohc_stopped_color").style.backgroundColor = settingsUserData.ohc.stopped_color, document.getElementById("settings_main_ohc_moving").checked = settingsUserData.ohc.moving, document.getElementById("settings_main_ohc_moving_color").value = settingsUserData.ohc.moving_color.substr(1), document.getElementById("settings_main_ohc_moving_color").style.backgroundColor = settingsUserData.ohc.moving_color, document.getElementById("settings_main_ohc_engine_idle").checked = settingsUserData.ohc.engine_idle, document.getElementById("settings_main_ohc_engine_idle_color").value = settingsUserData.ohc.engine_idle_color.substr(1), document.getElementById("settings_main_ohc_engine_idle_color").style.backgroundColor = settingsUserData.ohc.engine_idle_color, document.getElementById("settings_main_language").value = settingsUserData.language, document.getElementById("system_language").value = settingsUserData.language, document.getElementById("settings_main_distance_unit").value = settingsUserData.unit_distance, document.getElementById("settings_main_capacity_unit").value = settingsUserData.unit_capacity, document.getElementById("settings_main_temperature_unit").value = settingsUserData.unit_temperature, document.getElementById("settings_main_currency").value = settingsUserData.currency, document.getElementById("settings_main_timezone").value = settingsUserData.timezone, 11 == settingsUserData.dst_start.length && 11 == settingsUserData.dst_end.length) {
                        document.getElementById("settings_main_dst").checked = strToBoolean(settingsUserData.dst);
                        var a = settingsUserData.dst_start.split(" ");
                        document.getElementById("settings_main_dst_start_mmdd").value = a[0], document.getElementById("settings_main_dst_start_hhmm").value = a[1];
                        var o = settingsUserData.dst_end.split(" ");
                        document.getElementById("settings_main_dst_end_mmdd").value = o[0], document.getElementById("settings_main_dst_end_hhmm").value = o[1]
                    } else document.getElementById("settings_main_dst").checked = !1, document.getElementById("settings_main_dst_start_mmdd").value = "", document.getElementById("settings_main_dst_start_hhmm").value = "00:00", document.getElementById("settings_main_dst_end_mmdd").value = "", document.getElementById("settings_main_dst_end_hhmm").value = "00:00";
                    var i = settingsUserData.info;
                    document.getElementById("settings_main_name_surname").value = i.name, document.getElementById("settings_main_company").value = i.company, document.getElementById("settings_main_address").value = i.address, document.getElementById("settings_main_post_code").value = i.post_code, document.getElementById("settings_main_city").value = i.city, document.getElementById("settings_main_country").value = i.country, document.getElementById("settings_main_phone1").value = i.phone1, document.getElementById("settings_main_phone2").value = i.phone2, document.getElementById("settings_main_email").value = i.email, settingsCheck(), t(!0)
                }
            });
            break;
        case "objects":
            i = {
                cmd: "load_object_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsObjectData = e, settingsEditData.sensor_id = !1, initSelectList("group_object_list"), initSelectList("events_object_list"), initSelectList("subaccounts_object_list"), initSelectList("history_object_list"), initSelectList("report_object_list"), initSelectList("rilogbook_object_list"), initSelectList("dtc_object_list"), initSelectList("cmd_object_list"), initSelectList("gallery_object_list"), loadObjectMapMarkerIcons(), t(!0)
                }
            });
            break;
        case "object_groups":
            i = {
                cmd: "load_object_group_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.groups.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsObjectGroupData = e, settingsEditData.group_id = !1, initSelectList("object_group_list"), t(!0)
                }
            });
            break;
        case "object_drivers":
            i = {
                cmd: "load_object_driver_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.drivers.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsObjectDriverData = e, settingsEditData.driver_id = !1, initSelectList("object_driver_list"), t(!0)
                }
            });
            break;
        case "object_trailers":
            i = {
                cmd: "load_object_trailer_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.trailers.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsObjectTrailerData = e, settingsEditData.trailer_id = !1, initSelectList("object_trailer_list"), t(!0)
                }
            });
            break;
        case "events":
            i = {
                cmd: "load_event_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.events.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsEventData = e, settingsEditData.event_id = !1, t(!0)
                }
            });
            break;
        case "templates":
            i = {
                cmd: "load_template_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.templates.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsTemplateData = e, settingsEditData.template_id = !1, initSelectList("email_sms_template_list"), t(!0)
                }
            });
            break;
        case "subaccounts":
            var i = {
                cmd: "load_subaccount_data"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.subaccounts.php",
                data: i,
                dataType: "json",
                cache: !1,
                success: function(e) {
                    settingsSubaccountData = e, settingsEditData.subaccount_id = !1, t(!0)
                }
            })
    }
}

function settingsSave() {
    if (utilsCheckPrivileges("viewer")) {
        if ("subuser" != settingsUserData.privileges) var e = document.getElementById("settings_main_sms_gateway").checked,
            t = document.getElementById("settings_main_sms_gateway_type").value,
            a = document.getElementById("settings_main_sms_gateway_url").value,
            o = document.getElementById("settings_main_sms_gateway_identifier").value;
        else var e = "",
            t = "",
            a = "",
            o = "";
        var i = document.getElementById("settings_main_chat_notify_sound_file").value,
            s = document.getElementById("settings_main_map_startup_possition").value,
            n = document.getElementById("settings_main_map_icon_size").value,
            l = "#" + document.getElementById("settings_main_history_route_color").value,
            r = "#" + document.getElementById("settings_main_history_route_highlight_color").value,
            d = {
                objects: document.getElementById("settings_main_groups_collapsed_objects").checked,
                markers: document.getElementById("settings_main_groups_collapsed_markers").checked,
                routes: document.getElementById("settings_main_groups_collapsed_routes").checked,
                zones: document.getElementById("settings_main_groups_collapsed_zones").checked
            };
        d = JSON.stringify(d);
        var _ = document.getElementById("settings_main_od").value,
            c = {
                no_connection: document.getElementById("settings_main_ohc_no_connection").checked,
                no_connection_color: "#" + document.getElementById("settings_main_ohc_no_connection_color").value,
                stopped: document.getElementById("settings_main_ohc_stopped").checked,
                stopped_color: "#" + document.getElementById("settings_main_ohc_stopped_color").value,
                moving: document.getElementById("settings_main_ohc_moving").checked,
                moving_color: "#" + document.getElementById("settings_main_ohc_moving_color").value,
                engine_idle: document.getElementById("settings_main_ohc_engine_idle").checked,
                engine_idle_color: "#" + document.getElementById("settings_main_ohc_engine_idle_color").value
            };
        c = JSON.stringify(c);
        var g = document.getElementById("settings_main_language").value,
            m = document.getElementById("settings_main_distance_unit").value;
        m += "," + document.getElementById("settings_main_capacity_unit").value, m += "," + document.getElementById("settings_main_temperature_unit").value;
        var u = document.getElementById("settings_main_currency").value,
            p = document.getElementById("settings_main_timezone").value,
            y = document.getElementById("settings_main_dst").checked,
            v = document.getElementById("settings_main_dst_start_mmdd").value + " " + document.getElementById("settings_main_dst_start_hhmm").value,
            b = document.getElementById("settings_main_dst_end_mmdd").value + " " + document.getElementById("settings_main_dst_end_hhmm").value;
        0 != y && 11 == v.length && 11 == b.length || (y = !1, v = "", b = "");
        var E = {
            name: document.getElementById("settings_main_name_surname").value,
            company: document.getElementById("settings_main_company").value,
            address: document.getElementById("settings_main_address").value,
            post_code: document.getElementById("settings_main_post_code").value,
            city: document.getElementById("settings_main_city").value,
            country: document.getElementById("settings_main_country").value,
            phone1: document.getElementById("settings_main_phone1").value,
            phone2: document.getElementById("settings_main_phone2").value,
            email: document.getElementById("settings_main_email").value
        };
        E = JSON.stringify(E);
        var h = document.getElementById("settings_main_old_password").value,
            f = document.getElementById("settings_main_new_password").value,
            I = document.getElementById("settings_main_new_password_rep").value;
        if (h.length > 0) {
            if (f.length < 6) return void notifyBox("error", la.ERROR, la.PASSWORD_LENGHT_AT_LEAST);
            if (-1 != f.indexOf(" ")) return void notifyBox("error", la.ERROR, la.PASSWORD_SPACE_CHARACTERS);
            if (f != I) return void notifyBox("error", la.ERROR, la.REPEATED_PASSWORD_IS_INCORRECT)
        }
        var D = {
            cmd: "save_user_settings",
            sms_gateway: e,
            sms_gateway_type: t,
            sms_gateway_url: a,
            sms_gateway_identifier: o,
            chat_notify: i,
            map_sp: s,
            map_is: n,
            map_rc: l,
            map_rhc: r,
            groups_collapsed: d,
            od: _,
            ohc: c,
            language: g,
            units: m,
            currency: u,
            timezone: p,
            dst: y,
            dst_start: v,
            dst_end: b,
            info: E,
            old_password: h,
            new_password: f
        };
        $.ajax({
            type: "POST",
            url: "func/fn_settings.php",
            data: D,
            cache: !1,
            success: function(e) {
                "OK" == e ? (settingsReloadUser(), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_INCORRECT_PASSWORD" == e && notifyBox("error", la.ERROR, la.INCORRECT_PASSWORD)
            }
        })
    }
}

function settingsSaveCookies() {
    var e = guiDragbars.objects + ";" + guiDragbars.events + ";" + guiDragbars.history + ";" + guiDragbars.bottom_panel;
    if (setCookie("gs_dragbars", e, 30), void 0 != map && map.getZoom() && map.getCenter() && map.getCenter()) {
        var t = map.getCenter().lat + ";" + map.getCenter().lng + ";" + map.getZoom() + ";" + gsValues.map_layer + ";";
        t += gsValues.map_objects + ";" + gsValues.map_object_labels + ";" + gsValues.map_markers + ";" + gsValues.map_routes + ";" + gsValues.map_zones + ";" + gsValues.map_clusters, setCookie("gs_map", t, 30)
    }
}

function settingsChatPlaySound() {
    var e = document.getElementById("settings_main_chat_notify_sound_file").value;
    "" != e && new Audio("snd/" + e).play()
}

function settingsSMSGatewayClearQueue() {
    confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_SMS_QUEUE, function(e) {
        if (e) {
            var t = {
                cmd: "clear_sms_queue"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.php",
                data: t,
                success: function(e) {
                    "OK" == e && (document.getElementById("settings_main_sms_gateway_total_in_queue").innerHTML = "0")
                }
            })
        }
    })
}

function settingsSMSGatewaySwitchType() {
    "app" == document.getElementById("settings_main_sms_gateway_type").value ? (document.getElementById("settings_main_sms_app").style.display = "", document.getElementById("settings_main_sms_http").style.display = "none") : (document.getElementById("settings_main_sms_app").style.display = "none", document.getElementById("settings_main_sms_http").style.display = "")
}

function settingsObjectAdd(e) {
    if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_add")) switch (e) {
        case "open":
            document.getElementById("dialog_settings_object_add_name").value = "", document.getElementById("dialog_settings_object_add_imei").value = "", $("#dialog_settings_object_add").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_add").dialog("close");
            break;
        case "add":
            if (!utilsCheckPrivileges("viewer")) return;
            var t = document.getElementById("dialog_settings_object_add_name").value,
                a = document.getElementById("dialog_settings_object_add_imei").value;
            if ("" == t) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
            if (!isIMEIValid(a)) return void notifyBox("error", la.ERROR, la.IMEI_IS_NOT_VALID);
            var o = {
                cmd: "add_object",
                name: t,
                imei: a
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: o,
                cache: !1,
                success: function(e) {
                    "OK" == e ? (settingsReloadObjects(), $("#dialog_settings_object_add").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_IMEI_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_IMEI_ALREADY_EXISTS) : "ERROR_OBJECT_LIMIT" == e && notifyBox("error", la.ERROR, la.OBJECT_LIMIT_IS_REACHED)
                }
            })
    }
}

function settingsObjectClearHistory(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_history_clear") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_HISTORY_EVENTS, function(t) {
        if (t) {
            var a = {
                cmd: "clear_history_object",
                imei: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadObjects()
                }
            })
        }
    })
}

function settingsObjectDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_object",
                imei: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadObjects()
                }
            })
        }
    })
}

function settingsObjectClearHistorySelected() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit")) {
        var e = $("#settings_main_object_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_SELECTED_ITEMS_HISTORY_EVENTS, function(t) {
            if (t) {
                var a = {
                    cmd: "clear_history_selected_objects",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.objects.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadObjects()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectDeleteSelected() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit")) {
        var e = $("#settings_main_object_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_objects",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.objects.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadObjects()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectDuplicate(e) {
    if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_add")) switch (e) {
        default:
            o = e;
            settingsEditData.object_duplicate_imei = o, document.getElementById("dialog_settings_object_duplicate_name").value = "", document.getElementById("dialog_settings_object_duplicate_imei").value = "", $("#dialog_settings_object_duplicate").dialog("open");
            break;
        case "duplicate":
            if (!utilsCheckPrivileges("viewer")) return;
            var t = settingsEditData.object_duplicate_imei,
                a = document.getElementById("dialog_settings_object_duplicate_name").value,
                o = document.getElementById("dialog_settings_object_duplicate_imei").value;
            if ("" == a) return void notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
            if (!isIMEIValid(o)) return void notifyBox("error", la.ERROR, la.IMEI_IS_NOT_VALID);
            var i = {
                cmd: "duplicate_object",
                duplicate_imei: t,
                name: a,
                imei: o
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: i,
                cache: !1,
                success: function(e) {
                    "OK" == e ? (settingsReloadObjects(), $("#dialog_settings_object_duplicate").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_IMEI_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_IMEI_ALREADY_EXISTS) : "ERROR_OBJECT_LIMIT" == e && notifyBox("error", la.ERROR, la.OBJECT_LIMIT_IS_REACHED)
                }
            });
            break;
        case "cancel":
            $("#dialog_settings_object_duplicate").dialog("close")
    }
}

function settingsObjectEdit(e) {
    if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("obj_edit")) switch (e) {
        default:
            r = e;
            settingsEditData.object_imei = r;
            t = settingsObjectData[r].group_id;
            void 0 == settingsObjectGroupData[t] ? document.getElementById("dialog_settings_object_edit_group").value = 0 : document.getElementById("dialog_settings_object_edit_group").value = settingsObjectData[r].group_id, $("#dialog_settings_object_edit_group").multipleSelect("refresh");
            a = settingsObjectData[r].driver_id;
            void 0 == settingsObjectDriverData[a] ? document.getElementById("dialog_settings_object_edit_driver").value = 0 : document.getElementById("dialog_settings_object_edit_driver").value = settingsObjectData[r].driver_id, $("#dialog_settings_object_edit_driver").multipleSelect("refresh");
            o = settingsObjectData[r].trailer_id;
            void 0 == settingsObjectTrailerData[o] ? document.getElementById("dialog_settings_object_edit_trailer").value = 0 : document.getElementById("dialog_settings_object_edit_trailer").value = settingsObjectData[r].trailer_id, $("#dialog_settings_object_edit_trailer").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_name").value = settingsObjectData[r].name, document.getElementById("dialog_settings_object_edit_imei").value = r, document.getElementById("dialog_settings_object_edit_device").value = settingsObjectData[r].device, $("#dialog_settings_object_edit_device").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_sim_number").value = settingsObjectData[r].sim_number, document.getElementById("dialog_settings_object_edit_model").value = settingsObjectData[r].model, document.getElementById("dialog_settings_object_edit_vin").value = settingsObjectData[r].vin, document.getElementById("dialog_settings_object_edit_plate_number").value = settingsObjectData[r].plate_number, document.getElementById("dialog_settings_object_edit_icon").innerHTML = '<img src="' + settingsObjectData[r].icon + '" />', settingsEditData.object_icon = settingsObjectData[r].icon;
            n = settingsObjectData[r].map_arrows;
            document.getElementById("dialog_settings_object_edit_arrow_no_connection").value = n.arrow_no_connection, $("#dialog_settings_object_edit_arrow_no_connection").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_arrow_stopped").value = n.arrow_stopped, $("#dialog_settings_object_edit_arrow_stopped").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_arrow_moving").value = n.arrow_moving, $("#dialog_settings_object_edit_arrow_moving").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_arrow_engine_idle").value = n.arrow_engine_idle, $("#dialog_settings_object_edit_arrow_engine_idle").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_map_icon").value = settingsObjectData[r].map_icon, $("#dialog_settings_object_edit_map_icon").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_tail_color").value = settingsObjectData[r].tail_color.substr(1), document.getElementById("dialog_settings_object_edit_tail_color").style.backgroundColor = settingsObjectData[r].tail_color, document.getElementById("dialog_settings_object_edit_tail_points").value = settingsObjectData[r].tail_points, document.getElementById("dialog_settings_object_edit_fcr_source").value = settingsObjectData[r].fcr.source, $("#dialog_settings_object_edit_fcr_source").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_fcr_measurement").value = settingsObjectData[r].fcr.measurement, $("#dialog_settings_object_edit_fcr_measurement").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_fcr_cost").value = settingsObjectData[r].fcr.cost, document.getElementById("dialog_settings_object_edit_fcr_summer").value = settingsObjectData[r].fcr.summer, document.getElementById("dialog_settings_object_edit_fcr_winter").value = settingsObjectData[r].fcr.winter, document.getElementById("dialog_settings_object_edit_fcr_winter_start").value = settingsObjectData[r].fcr.winter_start, document.getElementById("dialog_settings_object_edit_fcr_winter_end").value = settingsObjectData[r].fcr.winter_end, settingsObjectEditSwitchFCRMeasurement(), document.getElementById("settings_object_accuracy_time_adj").value = settingsObjectData[r].time_adj, $("#settings_object_accuracy_time_adj").multipleSelect("refresh"), document.getElementById("settings_object_accuracy_detect_stops").value = settingsObjectData[r].accuracy.stops, $("#settings_object_accuracy_detect_stops").multipleSelect("refresh"), document.getElementById("settings_object_accuracy_moving_speed").value = settingsObjectData[r].accuracy.min_moving_speed, document.getElementById("settings_object_accuracy_idle_speed").value = settingsObjectData[r].accuracy.min_idle_speed, document.getElementById("settings_object_accuracy_diff_points").value = settingsObjectData[r].accuracy.min_diff_points, document.getElementById("settings_object_accuracy_use_gpslev").checked = settingsObjectData[r].accuracy.use_gpslev, document.getElementById("settings_object_accuracy_gpslev").value = settingsObjectData[r].accuracy.min_gpslev, document.getElementById("settings_object_accuracy_use_hdop").checked = settingsObjectData[r].accuracy.use_hdop, document.getElementById("settings_object_accuracy_hdop").value = settingsObjectData[r].accuracy.max_hdop, document.getElementById("settings_object_accuracy_fuel_speed").value = settingsObjectData[r].accuracy.min_fuel_speed, document.getElementById("settings_object_accuracy_ff").value = settingsObjectData[r].accuracy.min_ff, document.getElementById("settings_object_accuracy_ft").value = settingsObjectData[r].accuracy.min_ft, document.getElementById("dialog_settings_object_edit_odometer_type").value = settingsObjectData[r].odometer_type, $("#dialog_settings_object_edit_odometer_type").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_engine_hours_type").value = settingsObjectData[r].engine_hours_type, $("#dialog_settings_object_edit_engine_hours_type").multipleSelect("refresh"), document.getElementById("dialog_settings_object_edit_odometer").value = settingsObjectData[r].odometer, document.getElementById("dialog_settings_object_edit_engine_hours").value = settingsObjectData[r].engine_hours, settingsEditData.odometer = settingsObjectData[r].odometer, settingsEditData.engine_hours = settingsObjectData[r].engine_hours, $("#settings_object_sensor_list_grid").jqGrid("setGridParam", {
                url: "func/fn_settings.sensors.php?cmd=load_object_sensor_list&imei=" + r
            }).trigger("reloadGrid"), $("#settings_object_service_list_grid").jqGrid("setGridParam", {
                url: "func/fn_settings.service.php?cmd=load_object_service_list&imei=" + r
            }).trigger("reloadGrid"), $("#settings_object_custom_fields_list_grid").jqGrid("setGridParam", {
                url: "func/fn_settings.customfields.php?cmd=load_object_custom_field_list&imei=" + r
            }).trigger("reloadGrid"), $("#settings_object_info_list_grid").jqGrid("setGridParam", {
                url: "func/fn_settings.objects.php?cmd=load_object_info_list&imei=" + r
            }).trigger("reloadGrid"), $("#dialog_settings_object_edit").dialog("open");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var t = document.getElementById("dialog_settings_object_edit_group").value,
                a = document.getElementById("dialog_settings_object_edit_driver").value,
                o = document.getElementById("dialog_settings_object_edit_trailer").value,
                i = document.getElementById("dialog_settings_object_edit_name").value,
                s = settingsEditData.object_icon;
            fileExist(s) || (s = "img/markers/objects/land-truck.svg");
            var n = {
                arrow_no_connection: document.getElementById("dialog_settings_object_edit_arrow_no_connection").value,
                arrow_stopped: document.getElementById("dialog_settings_object_edit_arrow_stopped").value,
                arrow_moving: document.getElementById("dialog_settings_object_edit_arrow_moving").value,
                arrow_engine_idle: document.getElementById("dialog_settings_object_edit_arrow_engine_idle").value
            };
            n = JSON.stringify(n);
            var l = document.getElementById("dialog_settings_object_edit_map_icon").value,
                r = settingsEditData.object_imei,
                d = document.getElementById("dialog_settings_object_edit_device").value,
                _ = document.getElementById("dialog_settings_object_edit_model").value,
                c = document.getElementById("dialog_settings_object_edit_vin").value,
                g = document.getElementById("dialog_settings_object_edit_plate_number").value,
                m = document.getElementById("dialog_settings_object_edit_sim_number").value,
                u = "#" + document.getElementById("dialog_settings_object_edit_tail_color").value,
                p = document.getElementById("dialog_settings_object_edit_tail_points").value,
                y = {
                    source: document.getElementById("dialog_settings_object_edit_fcr_source").value,
                    measurement: document.getElementById("dialog_settings_object_edit_fcr_measurement").value,
                    cost: document.getElementById("dialog_settings_object_edit_fcr_cost").value,
                    summer: document.getElementById("dialog_settings_object_edit_fcr_summer").value,
                    winter: document.getElementById("dialog_settings_object_edit_fcr_winter").value,
                    winter_start: document.getElementById("dialog_settings_object_edit_fcr_winter_start").value,
                    winter_end: document.getElementById("dialog_settings_object_edit_fcr_winter_end").value
                };
            y = JSON.stringify(y), "" == document.getElementById("settings_object_accuracy_moving_speed").value && (document.getElementById("settings_object_accuracy_moving_speed").value = 6), "" == document.getElementById("settings_object_accuracy_idle_speed").value && (document.getElementById("settings_object_accuracy_idle_speed").value = 3), "" == document.getElementById("settings_object_accuracy_diff_points").value && (document.getElementById("settings_object_accuracy_diff_points").value = 5e-4), document.getElementById("settings_object_accuracy_gpslev").value < 1 && (document.getElementById("settings_object_accuracy_gpslev").value = 5), document.getElementById("settings_object_accuracy_hdop").value < 1 && (document.getElementById("settings_object_accuracy_hdop").value = 3), document.getElementById("settings_object_accuracy_fuel_speed").value < 1 && (document.getElementById("settings_object_accuracy_fuel_speed").value = 10), document.getElementById("settings_object_accuracy_ff").value < 1 && (document.getElementById("settings_object_accuracy_ff").value = 10), document.getElementById("settings_object_accuracy_ft").value < 1 && (document.getElementById("settings_object_accuracy_ft").value = 10);
            var v = document.getElementById("settings_object_accuracy_time_adj").value,
                b = {
                    stops: document.getElementById("settings_object_accuracy_detect_stops").value,
                    min_moving_speed: document.getElementById("settings_object_accuracy_moving_speed").value,
                    min_idle_speed: document.getElementById("settings_object_accuracy_idle_speed").value,
                    min_diff_points: document.getElementById("settings_object_accuracy_diff_points").value,
                    use_gpslev: document.getElementById("settings_object_accuracy_use_gpslev").checked,
                    min_gpslev: document.getElementById("settings_object_accuracy_gpslev").value,
                    use_hdop: document.getElementById("settings_object_accuracy_use_hdop").checked,
                    max_hdop: document.getElementById("settings_object_accuracy_hdop").value,
                    min_fuel_speed: document.getElementById("settings_object_accuracy_fuel_speed").value,
                    min_ff: document.getElementById("settings_object_accuracy_ff").value,
                    min_ft: document.getElementById("settings_object_accuracy_ft").value
                };
            b = JSON.stringify(b);
            var E = document.getElementById("dialog_settings_object_edit_odometer_type").value,
                h = document.getElementById("dialog_settings_object_edit_engine_hours_type").value,
                f = document.getElementById("dialog_settings_object_edit_odometer").value,
                I = document.getElementById("dialog_settings_object_edit_engine_hours").value;
            if (f == settingsEditData.odometer && (f = !1), I == settingsEditData.engine_hours && (I = !1), "" == i) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            var D = {
                cmd: "edit_object",
                group_id: t,
                driver_id: a,
                trailer_id: o,
                name: i,
                imei: r,
                device: d,
                sim_number: m,
                model: _,
                vin: c,
                plate_number: g,
                icon: s,
                map_arrows: n,
                map_icon: l,
                tail_color: u,
                tail_points: p,
                fcr: y,
                time_adj: v,
                accuracy: b,
                odometer_type: E,
                engine_hours_type: h,
                odometer: f,
                engine_hours: I
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: D,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjects(), $("#dialog_settings_object_edit").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            });
            break;
        case "cancel":
            $("#dialog_settings_object_edit").dialog("close")
    }
}

function settingsObjectEditSwitchTimeAdj() {
    confirmDialog(la.TIME_ADJ_WARNING, function(e) {
        if (!e) {
            var t = settingsEditData.object_imei;
            document.getElementById("settings_object_accuracy_time_adj").value = settingsObjectData[t].time_adj, $("#settings_object_accuracy_time_adj").multipleSelect("refresh")
        }
    })
}

function settingsObjectEditIcon() {
    $("#dialog_settings_object_edit_select_icon").dialog("open"), settingsObjectEditLoadDefaultIconList(), settingsObjectEditLoadCustomIconList()
}

function settingsObjectEditSelectDefaultIcon(e) {
    settingsEditData.object_icon = e, document.getElementById("dialog_settings_object_edit_icon").innerHTML = '<img src="' + e + '" />', $("#dialog_settings_object_edit_select_icon").dialog("close")
}

function settingsObjectEditSelectCustomIcon(e) {
    settingsEditData.object_icon = e, document.getElementById("dialog_settings_object_edit_icon").innerHTML = '<img src="' + e + '" />', $("#dialog_settings_object_edit_select_icon").dialog("close")
}

function settingsObjectEditLoadDefaultIconList() {
    0 == settingsEditData.default_icons_loaded && $.ajax({
        type: "POST",
        url: "func/fn_files.php",
        data: {
            path: "img/markers/objects"
        },
        dataType: "json",
        success: function(e) {
            var t = '<div class="row2">';
            for (document.getElementById("settings_object_edit_select_icon_default_list").innerHTML = "", i = 0; i < e.length; i++) {
                var a = "img/markers/objects/" + e[i];
                t += '<div class="icon-object-edit">', t += '<a href="#" onclick="settingsObjectEditSelectDefaultIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += "</div>"
            }
            t += "</div>", document.getElementById("settings_object_edit_select_icon_default_list").innerHTML = t, settingsEditData.default_icons_loaded = !0
        }
    })
}

function settingsObjectEditLoadCustomIconList() {
    0 == settingsEditData.custom_icons_loaded && $.ajax({
        type: "POST",
        url: "func/fn_files.php",
        data: {
            path: "data/user/objects"
        },
        dataType: "json",
        success: function(e) {
            var t = '<div class="row2">';
            for (document.getElementById("settings_object_edit_select_icon_custom_list").innerHTML = "", i = 0; i < e.length; i++) {
                var a = "data/user/objects/" + e[i];
                t += '<div class="icon-object-edit">', t += '<a href="#" onclick="settingsObjectEditSelectCustomIcon(\'' + a + "');\">", t += '<img src="' + a + '" style="padding:5px; width: 32px; height: 32px;"/>', t += "</a>", t += '<div class="icon-custom-delete">', t += '<a href="#" onclick="settingsObjectEditDeleteCustomIcon(\'' + a + "');\">", t += '<img border="0" src="theme/images/remove.svg" width="8px">', t += "</a>", t += "</div>", t += "</div>"
            }
            t += "</div>", document.getElementById("settings_object_edit_select_icon_custom_list").innerHTML = t, settingsEditData.custom_icons_loaded = !0
        }
    })
}

function settingsObjectEditUploadCustomIcon() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectEditUploadCustomIconFile, !1), document.getElementById("load_file").click())
}

function settingsObjectEditUploadCustomIconFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onloadend = function(e) {
        var a = e.target.result;
        if ("image/png" == t[0].type || "image/svg+xml" == t[0].type) {
            var o = new Image;
            o.src = a, o.onload = function() {
                if (o.src.includes("image/png")) {
                    if (32 != o.width || 32 != o.height) return void notifyBox("error", la.ERROR, la.ICON_SIZE_SHOULD_BE_32_32);
                    e = "func/fn_upload.php?file=object_icon_png"
                } else var e = "func/fn_upload.php?file=object_icon_svg";
                $.ajax({
                    url: e,
                    type: "POST",
                    data: a,
                    processData: !1,
                    contentType: !1,
                    success: function(e) {
                        settingsEditData.custom_icons_loaded = !1, settingsObjectEditLoadCustomIconList()
                    }
                })
            }, document.getElementById("load_file").value = ""
        } else notifyBox("error", la.ERROR, la.FILE_TYPE_MUST_BE_PNG_OR_SVG)
    }, a.readAsDataURL(t[0]), this.removeEventListener("change", settingsObjectEditUploadCustomIconFile, !1)
}

function settingsObjectEditDeleteCustomIcon(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ICON, function(t) {
        if (t) {
            var a = {
                cmd: "delete_custom_icon",
                file: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: a,
                success: function(e) {
                    "OK" == e && (settingsEditData.custom_icons_loaded = !1, settingsObjectEditLoadCustomIconList())
                }
            })
        }
    })
}

function settingsObjectEditDeleteAllCustomIcon() {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_ALL_CUSTOM_ICONS, function(e) {
        if (e) {
            var t = {
                cmd: "delete_all_custom_icons"
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.objects.php",
                data: t,
                success: function(e) {
                    "OK" == e && (settingsEditData.custom_icons_loaded = !1, settingsObjectEditLoadCustomIconList())
                }
            })
        }
    })
}

function settingsObjectEditSwitchFCRMeasurement() {
    "l100km" == document.getElementById("dialog_settings_object_edit_fcr_measurement").value ? (document.getElementById("dialog_settings_object_edit_fcr_cost_label").innerHTML = la.COST_PER_LITER, document.getElementById("dialog_settings_object_edit_fcr_summer_label").innerHTML = la.SUMMER_RATE_L100KM, document.getElementById("dialog_settings_object_edit_fcr_winter_label").innerHTML = la.WINTER_RATE_L100KM) : (document.getElementById("dialog_settings_object_edit_fcr_cost_label").innerHTML = la.COST_PER_GALLON, document.getElementById("dialog_settings_object_edit_fcr_summer_label").innerHTML = la.SUMMER_RATE_MPG, document.getElementById("dialog_settings_object_edit_fcr_winter_label").innerHTML = la.WINTER_RATE_MPG)
}

function settingsObjectSensorResultPreview() {
    var e = settingsEditData.object_imei;
    if (void 0 != objectsData[e].data[0]) {
        var t = objectsData[e].data[0].params,
            a = document.getElementById("dialog_settings_object_sensor_type").value,
            o = document.getElementById("dialog_settings_object_sensor_param").value,
            i = document.getElementById("dialog_settings_object_sensor_result_type").value,
            s = document.getElementById("dialog_settings_object_sensor_units").value,
            n = document.getElementById("dialog_settings_object_sensor_text_1").value,
            l = document.getElementById("dialog_settings_object_sensor_text_0").value,
            r = document.getElementById("dialog_settings_object_sensor_formula").value,
            d = document.getElementById("dialog_settings_object_sensor_lv").value,
            _ = document.getElementById("dialog_settings_object_sensor_hv").value,
            c = settingsEditData.sensor_calibration;
        1 == c.length && (c = []);
        var g = getParamValue(t, o);
        document.getElementById("dialog_settings_object_sensor_cur_param_val").value = g;
        var m = {
                type: a,
                param: o,
                result_type: i,
                text_1: n,
                text_0: l,
                units: s,
                lv: d,
                hv: _,
                formula: r,
                calibration: c
            },
            u = getSensorValue(t, m);
        document.getElementById("dialog_settings_object_sensor_result_preview").value = u.value_full
    }
}

function settingsObjectSensorImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectSensorImportSENFile, !1), document.getElementById("load_file").click())
}

function settingsObjectSensorExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=sen&imei=" + settingsEditData.object_imei;
        window.location = e
    }
}

function settingsObjectSensorImportSENFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.sen) {
                var a = settingsEditData.object_imei,
                    o = t.sensors.length;
                if (0 == o) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.SENSORS_FOUND, o) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var o = {
                            format: "sen",
                            data: e.target.result,
                            imei: a
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: o,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectSensorImportSENFile, !1)
}

function settingsObjectClearDetectedSensorCache() {
    var e = settingsEditData.object_imei;
    confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_CLEAR_DETECTED_SENSOR_CACHE, function(t) {
        if (t) {
            var a = {
                cmd: "clear_detected_sensor_cache",
                imei: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.sensors.php",
                data: a,
                success: function(e) {
                    "OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
                }
            })
        }
    })
}

function settingsObjectSensorProperties(a) {
    var b = settingsEditData.object_imei;
    switch (a) {
        default:
            var c = a;
            settingsEditData.sensor_id = c;
            var d = document.getElementById("dialog_settings_object_sensor_param");
            d.options.length = 0;
            for (var f = getObjectParamsArray(b), i = 0; i < f.length; i++) d.options.add(new Option(f[i], f[i]));
            document.getElementById("dialog_settings_object_sensor_type").value = settingsObjectData[b].sensors[c].type, $("#dialog_settings_object_sensor_type").multipleSelect("refresh"), settingsObjectSensorType(), document.getElementById("dialog_settings_object_sensor_result_type").value = settingsObjectData[b].sensors[c].result_type, $("#dialog_settings_object_sensor_result_type").multipleSelect("refresh"), settingsObjectSensorResultType(), document.getElementById("dialog_settings_object_sensor_name").value = settingsObjectData[b].sensors[c].name, document.getElementById("dialog_settings_object_sensor_param").value = settingsObjectData[b].sensors[c].param, $("#dialog_settings_object_sensor_param").multipleSelect("refresh"), document.getElementById("dialog_settings_object_sensor_units").value = settingsObjectData[b].sensors[c].units, document.getElementById("dialog_settings_object_sensor_text_1").value = settingsObjectData[b].sensors[c].text_1, document.getElementById("dialog_settings_object_sensor_text_0").value = settingsObjectData[b].sensors[c].text_0;
            var h = settingsObjectData[b].sensors[c].result_type;
            "abs" == h || "rel" == h ? (document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").checked = !1) : (document.getElementById("dialog_settings_object_sensor_data_list").checked = strToBoolean(settingsObjectData[b].sensors[c].data_list), document.getElementById("dialog_settings_object_sensor_popup").checked = strToBoolean(settingsObjectData[b].sensors[c].popup)), "value" != h && "accum" != h && "abs" != h && "rel" != h || (document.getElementById("dialog_settings_object_sensor_formula").value = settingsObjectData[b].sensors[c].formula), "percentage" == h ? (document.getElementById("dialog_settings_object_sensor_lv").value = settingsObjectData[b].sensors[c].lv, document.getElementById("dialog_settings_object_sensor_hv").value = settingsObjectData[b].sensors[c].hv) : (document.getElementById("dialog_settings_object_sensor_lv").value = "", document.getElementById("dialog_settings_object_sensor_hv").value = ""), document.getElementById("settings_object_sensor_calibration_x").value = "", document.getElementById("settings_object_sensor_calibration_y").value = "", settingsEditData.sensor_calibration = settingsObjectData[b].sensors[c].calibration.slice(0), settingsObjectSensorCalibrationList(), document.getElementById("dialog_settings_object_sensor_cur_param_val").value = "", document.getElementById("dialog_settings_object_sensor_result_preview").value = "", $("#dialog_settings_object_sensor_properties").dialog("open"), settingsObjectSensorResultPreview();
            break;
        case "add":
            if (settingsEditData.sensor_id = !1, "" != settingsObjectData[b].params) {
                var d = document.getElementById("dialog_settings_object_sensor_param");
                d.options.length = 0;
                for (var f = getObjectParamsArray(b), i = 0; i < f.length; i++) d.options.add(new Option(f[i], f[i]));
                document.getElementById("dialog_settings_object_sensor_type").value = "di", $("#dialog_settings_object_sensor_type").multipleSelect("refresh"), settingsObjectSensorType(), document.getElementById("dialog_settings_object_sensor_result_type").value = "logic", $("#dialog_settings_object_sensor_result_type").multipleSelect("refresh"), settingsObjectSensorResultType(), document.getElementById("dialog_settings_object_sensor_name").value = "", document.getElementById("dialog_settings_object_sensor_param").value = "", $("#dialog_settings_object_sensor_param").multipleSelect("refresh"), document.getElementById("dialog_settings_object_sensor_data_list").checked = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, document.getElementById("dialog_settings_object_sensor_cur_param_val").value = "", document.getElementById("dialog_settings_object_sensor_result_preview").value = "", $("#dialog_settings_object_sensor_properties").dialog("open")
            } else notifyBox("info", la.INFORMATION, la.SENSOR_PARAMETERS_ARE_NOT_DETECTED_FOR_THIS_GPS_DEVICE);
            break;
        case "cancel":
            $("#dialog_settings_object_sensor_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var j = document.getElementById("dialog_settings_object_sensor_name").value,
                type = document.getElementById("dialog_settings_object_sensor_type").value,
                param = document.getElementById("dialog_settings_object_sensor_param").value,
                data_list = document.getElementById("dialog_settings_object_sensor_data_list").checked,
                popup = document.getElementById("dialog_settings_object_sensor_popup").checked,
                h = document.getElementById("dialog_settings_object_sensor_result_type").value,
                units = document.getElementById("dialog_settings_object_sensor_units").value,
                text_1 = document.getElementById("dialog_settings_object_sensor_text_1").value,
                text_0 = document.getElementById("dialog_settings_object_sensor_text_0").value,
                lv = document.getElementById("dialog_settings_object_sensor_lv").value,
                hv = document.getElementById("dialog_settings_object_sensor_hv").value,
                formula = document.getElementById("dialog_settings_object_sensor_formula").value;
            if (("" == j || "" == param) && "abs" == h) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (("" == j || "" == param) && "rel" == h) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (("" == j || "" == param || "" == text_1 || "" == text_0) && "logic" == h) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (("" == j || "" == param) && "value" == h) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (("" == j || "" == param) && "string" == h) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (("" == j || "" == param || "" == lv || "" == hv) && "percentage" == h) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if ("" != formula) {
                formula = formula.toLowerCase(), formula = formula.replace(/[^-()\d/*+.x]/g, "");
                var k = formula.replace("x", "1");
                try {
                    eval(k)
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        notifyBox("error", la.ERROR, la.FORMULA_IS_NOT);
                        break
                    }
                    notifyBox("error", la.ERROR, la.FORMULA_IS_NOT);
                    break
                }
                if (!formula.match("x")) {
                    notifyBox("error", la.ERROR, la.FORMULA_IS_NOT);
                    break
                }
            }
            if (0 == settingsEditData.sensor_id) {
                if (0 != getSensorFromType(b, "acc") && "acc" == type) {
                    notifyBox("error", la.ERROR, la.IGNITION_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
                if (0 != getSensorFromType(b, "da") && "da" == type) {
                    notifyBox("error", la.ERROR, la.DRIVER_ASSIGN_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
                if (0 != getSensorFromType(b, "engh") && "engh" == type) {
                    notifyBox("error", la.ERROR, la.ENGINE_HOURS_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
                if (0 != getSensorFromType(b, "fuelcons") && "fuelcons" == type) {
                    notifyBox("error", la.ERROR, la.FUEL_CONSUMPTION_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
                if (0 != getSensorFromType(b, "odo") && "odo" == type) {
                    notifyBox("error", la.ERROR, la.ODOMETER_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
                if (0 != getSensorFromType(b, "pa") && "pa" == type) {
                    notifyBox("error", la.ERROR, la.PASSENGER_ASSIGN_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
                if (0 != getSensorFromType(b, "ta") && "ta" == type) {
                    notifyBox("error", la.ERROR, la.TRAILER_ASSIGN_SENSOR_IS_ALREADY_AVAILABLE);
                    break
                }
            }
            var l = settingsEditData.sensor_calibration;
            if (1 == l.length) {
                notifyBox("error", la.ERROR, la.AT_LEAST_TWO_CALIBRATION_POINTS);
                break
            }
            var l = JSON.stringify(l),
                data = {
                    cmd: "save_object_sensor",
                    sensor_id: settingsEditData.sensor_id,
                    imei: b,
                    name: j,
                    type: type,
                    param: param,
                    data_list: data_list,
                    popup: popup,
                    result_type: h,
                    text_1: text_1,
                    text_0: text_0,
                    units: units,
                    lv: lv,
                    hv: hv,
                    formula: formula,
                    calibration: l
                };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.sensors.php",
                data: data,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"), $("#dialog_settings_object_sensor_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsObjectSensorDelete(e) {
    if (utilsCheckPrivileges("viewer")) {
        var t = settingsEditData.object_imei;
        confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(a) {
            if (a) {
                var o = {
                    cmd: "delete_object_sensor",
                    sensor_id: e,
                    imei: t
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.sensors.php",
                    data: o,
                    success: function(e) {
                        "OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        })
    }
}

function settingsObjectSensorDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = settingsEditData.object_imei,
            t = $("#settings_object_sensor_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != t ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(a) {
            if (a) {
                var o = {
                    cmd: "delete_selected_object_sensors",
                    items: t,
                    imei: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.sensors.php",
                    data: o,
                    success: function(e) {
                        "OK" == e && (settingsReloadObjects(), $("#settings_object_sensor_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectSensorCalibrationList() {
    var e = settingsEditData.sensor_calibration,
        t = [],
        a = $("#settings_object_sensor_calibration_list_grid");
    if (a.clearGridData(!0), 0 != e.length) {
        for (i = 0; i < e.length; i++) {
            var o = '<a href="#" onclick="settingsObjectSensorCalibrationDel(' + i + ');" title="' + la.DELETE + '"><img src="theme/images/remove3.svg" /></a>';
            t.push({
                x: e[i].x,
                y: e[i].y,
                modify: o
            })
        }
        for (var i = 0; i < t.length; i++) a.jqGrid("addRowData", i, t[i]);
        a.setGridParam({
            sortname: "x",
            sortorder: "asc"
        }).trigger("reloadGrid")
    }
}

function settingsObjectSensorCalibrationAdd() {
    var e = document.getElementById("settings_object_sensor_calibration_x").value,
        t = document.getElementById("settings_object_sensor_calibration_y").value;
    isNumber(e) || (e = 0), isNumber(t) || (t = 0);
    for (var a = 0; a < settingsEditData.sensor_calibration.length; a++)
        if (settingsEditData.sensor_calibration[a].x == e) return void notifyBox("error", la.ERROR, la.SAME_X_CALIBRATION_CHECK_POINT_AVAILABLE);
    settingsEditData.sensor_calibration.push({
        x: e,
        y: t
    }), document.getElementById("settings_object_sensor_calibration_x").value = "", document.getElementById("settings_object_sensor_calibration_y").value = "", settingsObjectSensorCalibrationList()
}

function settingsObjectSensorCalibrationDel(e) {
    settingsEditData.sensor_calibration.splice(e, 1), settingsObjectSensorCalibrationList()
}

function settingsObjectSensorType() {
    var e = document.getElementById("dialog_settings_object_sensor_type").value,
        t = document.getElementById("dialog_settings_object_sensor_result_type");
    switch (t.options.length = 0, e) {
        case "di":
        case "do":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !1, t.options.add(new Option(la.LOGIC, "logic"));
            break;
        case "da":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, t.options.add(new Option(la.STRING, "string"));
            break;
        case "engh":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, t.options.add(new Option(la.ABSOLUTE, "abs")), t.options.add(new Option(la.RELATIVE, "rel"));
            break;
        case "fuel":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !1, t.options.add(new Option(la.VALUE, "value")), t.options.add(new Option("Percentage", "percentage"));
            break;
        case "fuelcons":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, t.options.add(new Option(la.ABSOLUTE, "abs")), t.options.add(new Option(la.RELATIVE, "rel"));
            break;
        case "acc":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !1, t.options.add(new Option(la.LOGIC, "logic"));
            break;
        case "odo":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, t.options.add(new Option(la.ABSOLUTE, "abs")), t.options.add(new Option(la.RELATIVE, "rel"));
            break;
        case "pa":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, t.options.add(new Option(la.STRING, "string"));
            break;
        case "temp":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !1, t.options.add(new Option(la.VALUE, "value"));
            break;
        case "ta":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !0, document.getElementById("dialog_settings_object_sensor_data_list").checked = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !0, document.getElementById("dialog_settings_object_sensor_popup").checked = !1, t.options.add(new Option(la.STRING, "string"));
            break;
        case "cust":
            document.getElementById("dialog_settings_object_sensor_data_list").enable = !1, document.getElementById("dialog_settings_object_sensor_popup").enable = !1, t.options.add(new Option(la.LOGIC, "logic")), t.options.add(new Option(la.VALUE, "value")), t.options.add(new Option(la.STRING, "string")), t.options.add(new Option(la.PERCENTAGE, "percentage"))
    }
    settingsObjectSensorResultType()
}

function settingsObjectSensorResultType() {
    switch (document.getElementById("dialog_settings_object_sensor_units").value = "", document.getElementById("dialog_settings_object_sensor_text_1").value = "", document.getElementById("dialog_settings_object_sensor_text_0").value = "", document.getElementById("dialog_settings_object_sensor_lv").value = "", document.getElementById("dialog_settings_object_sensor_hv").value = "", document.getElementById("dialog_settings_object_sensor_formula").value = "", document.getElementById("settings_object_sensor_calibration_x").value = "", document.getElementById("settings_object_sensor_calibration_y").value = "", settingsEditData.sensor_calibration = [], $("#settings_object_sensor_calibration_list_grid").clearGridData(!0), document.getElementById("dialog_settings_object_sensor_result_type").value) {
        case "abs":
        case "rel":
            document.getElementById("dialog_settings_object_sensor_units").enable = !0, document.getElementById("dialog_settings_object_sensor_text_1").enable = !0, document.getElementById("dialog_settings_object_sensor_text_0").enable = !0, document.getElementById("dialog_settings_object_sensor_lv").enable = !0, document.getElementById("dialog_settings_object_sensor_hv").enable = !0, document.getElementById("dialog_settings_object_sensor_formula").enable = !1, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("settings_object_sensor_calibration_x").enable = !0, document.getElementById("settings_object_sensor_calibration_y").enable = !0, document.getElementById("settings_object_sensor_calibration_add").enable = !0;
            break;
        case "logic":
            document.getElementById("dialog_settings_object_sensor_units").enable = !0, document.getElementById("dialog_settings_object_sensor_text_1").enable = !1, document.getElementById("dialog_settings_object_sensor_text_0").enable = !1, document.getElementById("dialog_settings_object_sensor_lv").enable = !0, document.getElementById("dialog_settings_object_sensor_hv").enable = !0, document.getElementById("dialog_settings_object_sensor_formula").enable = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("settings_object_sensor_calibration_x").enable = !0, document.getElementById("settings_object_sensor_calibration_y").enable = !0, document.getElementById("settings_object_sensor_calibration_add").enable = !0;
            break;
        case "value":
            document.getElementById("dialog_settings_object_sensor_units").enable = !1, document.getElementById("dialog_settings_object_sensor_text_1").enable = !0, document.getElementById("dialog_settings_object_sensor_text_0").enable = !0, document.getElementById("dialog_settings_object_sensor_lv").enable = !0, document.getElementById("dialog_settings_object_sensor_hv").enable = !0, document.getElementById("dialog_settings_object_sensor_formula").enable = !1, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").unblock(), document.getElementById("settings_object_sensor_calibration_x").enable = !1, document.getElementById("settings_object_sensor_calibration_y").enable = !1, document.getElementById("settings_object_sensor_calibration_add").enable = !1;
            break;
        case "string":
            document.getElementById("dialog_settings_object_sensor_units").enable = !0, document.getElementById("dialog_settings_object_sensor_text_1").enable = !0, document.getElementById("dialog_settings_object_sensor_text_0").enable = !0, document.getElementById("dialog_settings_object_sensor_lv").enable = !0, document.getElementById("dialog_settings_object_sensor_hv").enable = !0, document.getElementById("dialog_settings_object_sensor_formula").enable = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("settings_object_sensor_calibration_x").enable = !0, document.getElementById("settings_object_sensor_calibration_y").enable = !0, document.getElementById("settings_object_sensor_calibration_add").enable = !0;
            break;
        case "percentage":
            document.getElementById("dialog_settings_object_sensor_units").value = "%", document.getElementById("dialog_settings_object_sensor_units").enable = !0, document.getElementById("dialog_settings_object_sensor_text_1").enable = !0, document.getElementById("dialog_settings_object_sensor_text_0").enable = !0, document.getElementById("dialog_settings_object_sensor_lv").enable = !1, document.getElementById("dialog_settings_object_sensor_hv").enable = !1, document.getElementById("dialog_settings_object_sensor_formula").enable = !0, $("#settings_object_sensor_calibration_list_grid").closest(".ui-jqgrid").block({
                message: ""
            }), document.getElementById("settings_object_sensor_calibration_x").enable = !0, document.getElementById("settings_object_sensor_calibration_y").enable = !0, document.getElementById("settings_object_sensor_calibration_add").enable = !0
    }
}

function settingsObjectServiceImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectServiceImportSERFile, !1), document.getElementById("load_file").click())
}

function settingsObjectServiceExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=ser&imei=" + settingsEditData.object_imei;
        window.location = e
    }
}

function settingsObjectServiceImportSERFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.ser) {
                var a = settingsEditData.object_imei,
                    o = t.services.length;
                if (0 == o) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.SERVICES_FOUND, o) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var o = {
                            format: "ser",
                            data: e.target.result,
                            imei: a
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: o,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && (settingsReloadObjects(), $("#settings_object_service_list_grid").trigger("reloadGrid"))
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectServiceImportSERFile, !1)
}

function settingsObjectServiceProperties(e) {
    var t = settingsEditData.object_imei;
    switch (e) {
        default:
            var a = e;
            settingsEditData.service_id = a, document.getElementById("dialog_settings_object_service_name").value = settingsObjectData[t].service[a].name, document.getElementById("dialog_settings_object_service_data_list").checked = strToBoolean(settingsObjectData[t].service[a].data_list), document.getElementById("dialog_settings_object_service_popup").checked = strToBoolean(settingsObjectData[t].service[a].popup), document.getElementById("dialog_settings_object_service_odo").checked = strToBoolean(settingsObjectData[t].service[a].odo), 1 == document.getElementById("dialog_settings_object_service_odo").checked ? (document.getElementById("dialog_settings_object_service_odo_interval").value = settingsObjectData[t].service[a].odo_interval, document.getElementById("dialog_settings_object_service_odo_last").value = settingsObjectData[t].service[a].odo_last, document.getElementById("dialog_settings_object_service_odo_left").checked = strToBoolean(settingsObjectData[t].service[a].odo_left), document.getElementById("dialog_settings_object_service_odo_left_num").value = settingsObjectData[t].service[a].odo_left_num) : (document.getElementById("dialog_settings_object_service_odo_interval").value = "", document.getElementById("dialog_settings_object_service_odo_last").value = "", document.getElementById("dialog_settings_object_service_odo_left").checked = !1, document.getElementById("dialog_settings_object_service_odo_left_num").value = ""), document.getElementById("dialog_settings_object_service_engh").checked = strToBoolean(settingsObjectData[t].service[a].engh), 1 == document.getElementById("dialog_settings_object_service_engh").checked ? (document.getElementById("dialog_settings_object_service_engh_interval").value = settingsObjectData[t].service[a].engh_interval, document.getElementById("dialog_settings_object_service_engh_last").value = settingsObjectData[t].service[a].engh_last, document.getElementById("dialog_settings_object_service_engh_left").checked = strToBoolean(settingsObjectData[t].service[a].engh_left), document.getElementById("dialog_settings_object_service_engh_left_num").value = settingsObjectData[t].service[a].engh_left_num) : (document.getElementById("dialog_settings_object_service_engh_interval").value = "", document.getElementById("dialog_settings_object_service_engh_last").value = "", document.getElementById("dialog_settings_object_service_engh_left").checked = !1, document.getElementById("dialog_settings_object_service_engh_left_num").value = ""), document.getElementById("dialog_settings_object_service_days").checked = strToBoolean(settingsObjectData[t].service[a].days), 1 == document.getElementById("dialog_settings_object_service_days").checked ? (document.getElementById("dialog_settings_object_service_days_interval").value = settingsObjectData[t].service[a].days_interval, document.getElementById("dialog_settings_object_service_days_last").value = settingsObjectData[t].service[a].days_last, document.getElementById("dialog_settings_object_service_days_left").checked = strToBoolean(settingsObjectData[t].service[a].days_left), document.getElementById("dialog_settings_object_service_days_left_num").value = settingsObjectData[t].service[a].days_left_num) : (document.getElementById("dialog_settings_object_service_days_interval").value = "", document.getElementById("dialog_settings_object_service_days_last").value = "", document.getElementById("dialog_settings_object_service_days_left").checked = !1, document.getElementById("dialog_settings_object_service_days_left_num").value = ""), document.getElementById("dialog_settings_object_service_update_last").checked = strToBoolean(settingsObjectData[t].service[a].update_last), document.getElementById("dialog_settings_object_service_odo_curr").value = settingsObjectData[t].odometer, document.getElementById("dialog_settings_object_service_engh_curr").value = settingsObjectData[t].engine_hours, settingsObjectServiceCheck(), $("#dialog_settings_object_service_properties").dialog("open");
            break;
        case "add":
            settingsEditData.service_id = !1, document.getElementById("dialog_settings_object_service_name").value = "", document.getElementById("dialog_settings_object_service_data_list").checked = !1, document.getElementById("dialog_settings_object_service_popup").checked = !1, document.getElementById("dialog_settings_object_service_odo").checked = !1, document.getElementById("dialog_settings_object_service_odo_interval").value = "", document.getElementById("dialog_settings_object_service_odo_last").value = "", document.getElementById("dialog_settings_object_service_engh").checked = !1, document.getElementById("dialog_settings_object_service_engh_interval").value = "", document.getElementById("dialog_settings_object_service_engh_last").value = "", document.getElementById("dialog_settings_object_service_days").checked = !1, document.getElementById("dialog_settings_object_service_days_interval").value = "", document.getElementById("dialog_settings_object_service_days_last").value = "", document.getElementById("dialog_settings_object_service_odo_left").checked = !1, document.getElementById("dialog_settings_object_service_odo_left_num").value = "", document.getElementById("dialog_settings_object_service_engh_left").checked = !1, document.getElementById("dialog_settings_object_service_engh_left_num").value = "", document.getElementById("dialog_settings_object_service_days_left").checked = !1, document.getElementById("dialog_settings_object_service_days_left_num").value = "", document.getElementById("dialog_settings_object_service_update_last").checked = !1, document.getElementById("dialog_settings_object_service_odo_curr").value = settingsObjectData[t].odometer, document.getElementById("dialog_settings_object_service_engh_curr").value = settingsObjectData[t].engine_hours, settingsObjectServiceCheck(), $("#dialog_settings_object_service_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_service_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var o = document.getElementById("dialog_settings_object_service_name").value,
                i = document.getElementById("dialog_settings_object_service_data_list").checked,
                s = document.getElementById("dialog_settings_object_service_popup").checked,
                n = document.getElementById("dialog_settings_object_service_odo").checked,
                l = document.getElementById("dialog_settings_object_service_odo_interval").value,
                r = document.getElementById("dialog_settings_object_service_odo_last").value,
                d = document.getElementById("dialog_settings_object_service_engh").checked,
                _ = document.getElementById("dialog_settings_object_service_engh_interval").value,
                c = document.getElementById("dialog_settings_object_service_engh_last").value,
                g = document.getElementById("dialog_settings_object_service_days").checked,
                m = document.getElementById("dialog_settings_object_service_days_interval").value,
                u = document.getElementById("dialog_settings_object_service_days_last").value,
                p = document.getElementById("dialog_settings_object_service_odo_left").checked,
                y = document.getElementById("dialog_settings_object_service_odo_left_num").value,
                v = document.getElementById("dialog_settings_object_service_engh_left").checked,
                b = document.getElementById("dialog_settings_object_service_engh_left_num").value,
                E = document.getElementById("dialog_settings_object_service_days_left").checked,
                h = document.getElementById("dialog_settings_object_service_days_left_num").value,
                f = document.getElementById("dialog_settings_object_service_update_last").checked;
            if ("" == o) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (1 == n && ("" == l || "" == r)) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (1 == d && ("" == _ || "" == c)) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (1 == g && ("" == m || "" == u)) {
                notifyBox("error", la.ERROR, la.ALL_AVAILABLE_FIELDS_SHOULD_BE_FILLED_OUT);
                break
            }
            if (parseFloat(l) <= parseFloat(y) && 1 == p) {
                notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
                break
            }
            if (parseFloat(_) <= parseFloat(b) && 1 == v) {
                notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
                break
            }
            if (parseFloat(m) <= parseFloat(h) && 1 == E) {
                notifyBox("error", la.ERROR, la.INTERVAL_VALUE_SHOULD_BE_GREATER_THAN_LEFT_VALUE);
                break
            }
            var I = {
                cmd: "save_object_service",
                service_id: settingsEditData.service_id,
                imei: t,
                name: o,
                data_list: i,
                popup: s,
                odo: n,
                odo_interval: l,
                odo_last: r,
                engh: d,
                engh_interval: _,
                engh_last: c,
                days: g,
                days_interval: m,
                days_last: u,
                odo_left: p,
                odo_left_num: y,
                engh_left: v,
                engh_left_num: b,
                days_left: E,
                days_left_num: h,
                update_last: f
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.service.php",
                data: I,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjects(), $("#dialog_settings_object_service_properties").dialog("close"), $("#settings_object_service_list_grid").trigger("reloadGrid"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsObjectServiceDelete(e) {
    if (utilsCheckPrivileges("viewer")) {
        var t = settingsEditData.object_imei;
        confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(a) {
            if (a) {
                var o = {
                    cmd: "delete_object_service",
                    service_id: e,
                    imei: t
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.service.php",
                    data: o,
                    success: function(e) {
                        "OK" == e && (settingsReloadObjects(), $("#settings_object_service_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        })
    }
}

function settingsObjectServiceDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = settingsEditData.object_imei,
            t = $("#settings_object_service_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != t ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(a) {
            if (a) {
                var o = {
                    cmd: "delete_selected_object_services",
                    items: t,
                    imei: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.service.php",
                    data: o,
                    success: function(e) {
                        "OK" == e && (settingsReloadObjects(), $("#settings_object_service_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectServiceCheck() {
    1 == document.getElementById("dialog_settings_object_service_odo").checked ? (document.getElementById("dialog_settings_object_service_odo_interval").enable = !1, document.getElementById("dialog_settings_object_service_odo_last").enable = !1, document.getElementById("dialog_settings_object_service_odo_left").enable = !1, document.getElementById("dialog_settings_object_service_odo_left_num").enable = !1) : (document.getElementById("dialog_settings_object_service_odo_interval").enable = !0, document.getElementById("dialog_settings_object_service_odo_last").enable = !0, document.getElementById("dialog_settings_object_service_odo_left").enable = !0, document.getElementById("dialog_settings_object_service_odo_left_num").enable = !0), 1 == document.getElementById("dialog_settings_object_service_engh").checked ? (document.getElementById("dialog_settings_object_service_engh_interval").enable = !1, document.getElementById("dialog_settings_object_service_engh_last").enable = !1, document.getElementById("dialog_settings_object_service_engh_left").enable = !1, document.getElementById("dialog_settings_object_service_engh_left_num").enable = !1) : (document.getElementById("dialog_settings_object_service_engh_interval").enable = !0, document.getElementById("dialog_settings_object_service_engh_last").enable = !0, document.getElementById("dialog_settings_object_service_engh_left").enable = !0, document.getElementById("dialog_settings_object_service_engh_left_num").enable = !0), 1 == document.getElementById("dialog_settings_object_service_days").checked ? (document.getElementById("dialog_settings_object_service_days_interval").enable = !1, document.getElementById("dialog_settings_object_service_days_last").enable = !1, document.getElementById("dialog_settings_object_service_days_left").enable = !1, document.getElementById("dialog_settings_object_service_days_left_num").enable = !1) : (document.getElementById("dialog_settings_object_service_days_interval").enable = !0, document.getElementById("dialog_settings_object_service_days_last").enable = !0, document.getElementById("dialog_settings_object_service_days_left").enable = !0, document.getElementById("dialog_settings_object_service_days_left_num").enable = !0), 1 == document.getElementById("dialog_settings_object_service_odo").checked || 1 == document.getElementById("dialog_settings_object_service_engh").checked || 1 == document.getElementById("dialog_settings_object_service_days").checked ? document.getElementById("dialog_settings_object_service_update_last").enable = !1 : document.getElementById("dialog_settings_object_service_update_last").enable = !0
}

function settingsObjectCustomFieldImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsObjectCustomFieldImportCFLFile, !1), document.getElementById("load_file").click())
}

function settingsObjectCustomFieldExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=cfl&imei=" + settingsEditData.object_imei;
        window.location = e
    }
}

function settingsObjectCustomFieldImportCFLFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.cfl) {
                var a = settingsEditData.object_imei,
                    o = t.fields.length;
                if (0 == o) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.CUSTOM_FIELDS_FOUND, o) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var o = {
                            format: "cfl",
                            data: e.target.result,
                            imei: a
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: o,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"))
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsObjectCustomFieldImportCFLFile, !1)
}

function settingsObjectCustomFieldDelete(e) {
    if (utilsCheckPrivileges("viewer")) {
        var t = settingsEditData.object_imei;
        confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(a) {
            if (a) {
                var o = {
                    cmd: "delete_object_custom_field",
                    field_id: e,
                    imei: t
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.customfields.php",
                    data: o,
                    success: function(e) {
                        "OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        })
    }
}

function settingsObjectCustomFieldDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = settingsEditData.object_imei,
            t = $("#settings_object_custom_fields_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != t ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(a) {
            if (a) {
                var o = {
                    cmd: "delete_selected_object_custom_fields",
                    items: t,
                    imei: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.customfields.php",
                    data: o,
                    success: function(e) {
                        "OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"))
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsObjectCustomFieldProperties(e) {
    var t = settingsEditData.object_imei;
    switch (e) {
        default:
            var a = e;
            settingsEditData.custom_field_id = a, document.getElementById("dialog_settings_object_custom_field_name").value = settingsObjectData[t].custom_fields[a].name, document.getElementById("dialog_settings_object_custom_field_value").value = settingsObjectData[t].custom_fields[a].value, document.getElementById("dialog_settings_object_custom_field_data_list").checked = strToBoolean(settingsObjectData[t].custom_fields[a].data_list), document.getElementById("dialog_settings_object_custom_field_popup").checked = strToBoolean(settingsObjectData[t].custom_fields[a].popup), $("#dialog_settings_object_custom_field_properties").dialog("open");
            break;
        case "add":
            settingsEditData.custom_field_id = !1, document.getElementById("dialog_settings_object_custom_field_name").value = "", document.getElementById("dialog_settings_object_custom_field_value").value = "", document.getElementById("dialog_settings_object_custom_field_data_list").checked = !0, document.getElementById("dialog_settings_object_custom_field_popup").checked = !0, $("#dialog_settings_object_custom_field_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_object_custom_field_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var o = document.getElementById("dialog_settings_object_custom_field_name").value,
                i = document.getElementById("dialog_settings_object_custom_field_value").value,
                s = document.getElementById("dialog_settings_object_custom_field_data_list").checked,
                n = document.getElementById("dialog_settings_object_custom_field_popup").checked;
            if ("" == o) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            var l = {
                cmd: "save_object_custom_field",
                field_id: settingsEditData.custom_field_id,
                imei: t,
                name: o,
                value: i,
                data_list: s,
                popup: n
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.customfields.php",
                data: l,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadObjects(), $("#settings_object_custom_fields_list_grid").trigger("reloadGrid"), $("#dialog_settings_object_custom_field_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsTemplateImport() {
    utilsCheckPrivileges("viewer") && (document.getElementById("load_file").addEventListener("change", settingsTemplateImportTEMFile, !1), document.getElementById("load_file").click())
}

function settingsTemplateExport() {
    if (utilsCheckPrivileges("viewer")) {
        var e = "func/fn_export.php?format=tem";
        window.location = e
    }
}

function settingsTemplateImportTEMFile(e) {
    var t = e.target.files,
        a = new FileReader;
    a.onload = function(e) {
        try {
            var t = $.parseJSON(e.target.result);
            if ("0.1v" == t.tem) {
                var a = t.templates.length;
                if (0 == a) return void notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_TO_IMPORT);
                confirmDialog(sprintf(la.TEMPLATES_FOUND, a) + " " + la.ARE_YOU_SURE_YOU_WANT_TO_IMPORT, function(t) {
                    if (t) {
                        loadingData(!0);
                        var a = {
                            format: "tem",
                            data: e.target.result
                        };
                        $.ajax({
                            type: "POST",
                            url: "func/fn_import.php",
                            data: a,
                            cache: !1,
                            success: function(e) {
                                loadingData(!1), "OK" == e && settingsReloadTemplates()
                            },
                            error: function(e, t) {
                                loadingData(!1)
                            }
                        })
                    }
                })
            } else notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        } catch (e) {
            notifyBox("error", la.ERROR, la.INVALID_FILE_FORMAT)
        }
        document.getElementById("load_file").value = ""
    }, a.readAsText(t[0], "UTF-8"), this.removeEventListener("change", settingsTemplateImportTEMFile, !1)
}

function settingsTemplateProperties(e) {
    switch (e) {
        default:
            var t = e;
            settingsEditData.template_id = t, document.getElementById("dialog_settings_template_name").value = settingsTemplateData[t].name, document.getElementById("dialog_settings_template_desc").value = settingsTemplateData[t].desc, document.getElementById("dialog_settings_template_subject").value = settingsTemplateData[t].subject, document.getElementById("dialog_settings_template_message").value = settingsTemplateData[t].message, $("#dialog_settings_template_properties").dialog("open");
            break;
        case "add":
            settingsEditData.template_id = !1, document.getElementById("dialog_settings_template_name").value = "", document.getElementById("dialog_settings_template_desc").value = "", document.getElementById("dialog_settings_template_subject").value = "", document.getElementById("dialog_settings_template_message").value = "", $("#dialog_settings_template_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_template_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var a = document.getElementById("dialog_settings_template_name").value,
                o = document.getElementById("dialog_settings_template_desc").value,
                i = document.getElementById("dialog_settings_template_subject").value,
                s = document.getElementById("dialog_settings_template_message").value;
            if ("" == a) {
                notifyBox("error", la.ERROR, la.NAME_CANT_BE_EMPTY);
                break
            }
            var n = {
                cmd: "save_template",
                template_id: settingsEditData.template_id,
                name: a,
                desc: o,
                subject: i,
                message: s
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.templates.php",
                data: n,
                cache: !1,
                success: function(e) {
                    "OK" == e && (settingsReloadTemplates(), $("#dialog_settings_template_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY))
                }
            })
    }
}

function settingsTemplateDelete(e) {
    utilsCheckPrivileges("viewer") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_template",
                template_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.templates.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadTemplates()
                }
            })
        }
    })
}

function settingsTemplateDeleteSelected() {
    if (utilsCheckPrivileges("viewer")) {
        var e = $("#settings_main_templates_template_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_templates",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.templates.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadTemplates()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function settingsSubaccountGenerateAU() {
    var e = settingsUserData.email + moment();
    return CryptoJS.MD5(e).toString().toUpperCase()
}

function settingsSubaccountCheck() {
    1 == document.getElementById("dialog_settings_subaccount_expire").checked ? document.getElementById("dialog_settings_subaccount_expire_dt").enable = !1 : document.getElementById("dialog_settings_subaccount_expire_dt").enable = !0
}

function settingsSubaccountProperties(e) {
    if (utilsCheckPrivileges("subuser") && utilsCheckPrivileges("subaccounts")) switch (e) {
        default:
            var t = e;
            settingsEditData.subaccount_id = t, document.getElementById("dialog_settings_subaccount_email").value = settingsSubaccountData[t].email, document.getElementById("dialog_settings_subaccount_password").value = "", document.getElementById("dialog_settings_subaccount_active").checked = strToBoolean(settingsSubaccountData[t].active);
            m = strToBoolean(settingsSubaccountData[t].account_expire);
            document.getElementById("dialog_settings_subaccount_expire_dt").checked = m, document.getElementById("dialog_settings_subaccount_expire_dt").value = 1 == m ? settingsSubaccountData[t].account_expire_dt : "", document.getElementById("dialog_settings_subaccount_history").checked = settingsSubaccountData[t].history, document.getElementById("dialog_settings_subaccount_reports").checked = settingsSubaccountData[t].reports, document.getElementById("dialog_settings_subaccount_rilogbook").checked = settingsSubaccountData[t].rilogbook, document.getElementById("dialog_settings_subaccount_dtc").checked = settingsSubaccountData[t].dtc, document.getElementById("dialog_settings_subaccount_object_control").checked = settingsSubaccountData[t].object_control, document.getElementById("dialog_settings_subaccount_image_gallery").checked = settingsSubaccountData[t].image_gallery, document.getElementById("dialog_settings_subaccount_chat").checked = settingsSubaccountData[t].chat;
            var a = document.getElementById("dialog_settings_subaccount_available_objects"),
                o = settingsSubaccountData[t].imei.split(",");
            multiselectSetValues(a, o), $("#dialog_settings_subaccount_available_objects").multipleSelect("refresh");
            var i = document.getElementById("dialog_settings_subaccount_available_markers"),
                s = settingsSubaccountData[t].marker.split(",");
            multiselectSetValues(i, s), $("#dialog_settings_subaccount_available_markers").multipleSelect("refresh");
            var n = document.getElementById("dialog_settings_subaccount_available_routes"),
                l = settingsSubaccountData[t].route.split(",");
            multiselectSetValues(n, l), $("#dialog_settings_subaccount_available_routes").multipleSelect("refresh");
            var r = document.getElementById("dialog_settings_subaccount_available_zones"),
                d = settingsSubaccountData[t].zone.split(",");
            multiselectSetValues(r, d), $("#dialog_settings_subaccount_available_zones").multipleSelect("refresh"), document.getElementById("dialog_settings_subaccount_au_active").checked = settingsSubaccountData[t].au_active, settingsEditData.subaccount_au = settingsSubaccountData[t].au, "" == settingsEditData.subaccount_au && (settingsEditData.subaccount_au = settingsSubaccountGenerateAU()), document.getElementById("dialog_settings_subaccount_au").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au, document.getElementById("dialog_settings_subaccount_au_mobile").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au + "&m=true", settingsSubaccountCheck(), $("#dialog_settings_subaccount_properties").dialog("open");
            break;
        case "add":
            settingsEditData.subaccount_id = !1, document.getElementById("dialog_settings_subaccount_email").value = "", document.getElementById("dialog_settings_subaccount_password").value = "", document.getElementById("dialog_settings_subaccount_active").checked = !0, document.getElementById("dialog_settings_subaccount_expire").checked = !1, document.getElementById("dialog_settings_subaccount_expire_dt").value = "", document.getElementById("dialog_settings_subaccount_history").checked = !1, document.getElementById("dialog_settings_subaccount_reports").checked = !1, document.getElementById("dialog_settings_subaccount_rilogbook").checked = !1, document.getElementById("dialog_settings_subaccount_dtc").checked = !1, document.getElementById("dialog_settings_subaccount_object_control").checked = !1, document.getElementById("dialog_settings_subaccount_image_gallery").checked = !1, document.getElementById("dialog_settings_subaccount_chat").checked = !1, $("#dialog_settings_subaccount_available_objects option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_objects").multipleSelect("refresh"), $("#dialog_settings_subaccount_available_markers option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_markers").multipleSelect("refresh"), $("#dialog_settings_subaccount_available_routes option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_routes").multipleSelect("refresh"), $("#dialog_settings_subaccount_available_zones option:selected").removeAttr("selected"), $("#dialog_settings_subaccount_available_zones").multipleSelect("refresh"), document.getElementById("dialog_settings_subaccount_au_active").checked = !1, settingsEditData.subaccount_au = settingsSubaccountGenerateAU(), document.getElementById("dialog_settings_subaccount_au").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au, document.getElementById("dialog_settings_subaccount_au_mobile").value = gsValues.url_root + "/index.php?au=" + settingsEditData.subaccount_au + "&m=true", settingsSubaccountCheck(), $("#dialog_settings_subaccount_properties").dialog("open");
            break;
        case "cancel":
            $("#dialog_settings_subaccount_properties").dialog("close");
            break;
        case "save":
            if (!utilsCheckPrivileges("viewer")) return;
            var _ = document.getElementById("dialog_settings_subaccount_email").value,
                c = document.getElementById("dialog_settings_subaccount_password").value,
                g = document.getElementById("dialog_settings_subaccount_active").checked,
                m = document.getElementById("dialog_settings_subaccount_expire").checked,
                u = document.getElementById("dialog_settings_subaccount_expire_dt").value;
            if (!isEmailValid(_)) {
                notifyBox("error", la.ERROR, la.THIS_EMAIL_IS_NOT_VALID);
                break
            }
            if (0 == settingsEditData.subaccount_id) {
                if ("" == c) {
                    notifyBox("error", la.ERROR, la.PASSWORD_CANT_BE_EMPTY);
                    break
                }
                if (-1 != c.indexOf(" ")) return void notifyBox("error", la.ERROR, la.PASSWORD_SPACE_CHARACTERS);
                if (c.length < 6) {
                    notifyBox("error", la.ERROR, la.PASSWORD_LENGHT_AT_LEAST);
                    break
                }
            } else if ("" != c && c.length < 6) {
                notifyBox("error", la.ERROR, la.PASSWORD_LENGHT_AT_LEAST);
                break
            }
            if (1 == m) {
                if ("" == u) return void notifyBox("error", la.ERROR, la.DATE_CANT_BE_EMPTY, !0)
            } else u = "";
            var a = document.getElementById("dialog_settings_subaccount_available_objects"),
                i = document.getElementById("dialog_settings_subaccount_available_markers"),
                n = document.getElementById("dialog_settings_subaccount_available_routes"),
                r = document.getElementById("dialog_settings_subaccount_available_zones"),
                p = {
                    cmd: "save_subaccount",
                    subaccount_id: settingsEditData.subaccount_id,
                    active: g,
                    email: _,
                    password: c,
                    account_expire: m,
                    account_expire_dt: u,
                    history: document.getElementById("dialog_settings_subaccount_history").checked,
                    reports: document.getElementById("dialog_settings_subaccount_reports").checked,
                    rilogbook: document.getElementById("dialog_settings_subaccount_rilogbook").checked,
                    dtc: document.getElementById("dialog_settings_subaccount_dtc").checked,
                    object_control: document.getElementById("dialog_settings_subaccount_object_control").checked,
                    image_gallery: document.getElementById("dialog_settings_subaccount_image_gallery").checked,
                    chat: document.getElementById("dialog_settings_subaccount_chat").checked,
                    imei: multiselectGetValues(a),
                    marker: multiselectGetValues(i),
                    route: multiselectGetValues(n),
                    zone: multiselectGetValues(r),
                    au_active: document.getElementById("dialog_settings_subaccount_au_active").checked,
                    au: settingsEditData.subaccount_au
                };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.subaccounts.php",
                data: p,
                cache: !1,
                success: function(e) {
                    "OK" == e ? (settingsReloadSubaccounts(), $("#dialog_settings_subaccount_properties").dialog("close"), notifyBox("info", la.INFORMATION, la.CHANGES_SAVED_SUCCESSFULLY)) : "ERROR_EMAIL_EXISTS" == e ? notifyBox("error", la.ERROR, la.THIS_EMAIL_ALREADY_EXISTS) : "ERROR_NOT_SENT" == e && notifyBox("error", la.ERROR, la.CANT_SEND_EMAIL + " " + la.CONTACT_ADMINISTRATOR)
                }
            })
    }
}

function settingsSubaccountDelete(e) {
    utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("subaccounts") && confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE, function(t) {
        if (t) {
            var a = {
                cmd: "delete_subaccount",
                subaccount_id: e
            };
            $.ajax({
                type: "POST",
                url: "func/fn_settings.subaccounts.php",
                data: a,
                success: function(e) {
                    "OK" == e && settingsReloadSubaccounts()
                }
            })
        }
    })
}

function settingsSubaccountDeleteSelected() {
    if (utilsCheckPrivileges("viewer") && utilsCheckPrivileges("subuser") && utilsCheckPrivileges("subaccounts")) {
        var e = $("#settings_main_subaccount_list_grid").jqGrid("getGridParam", "selarrrow");
        "" != e ? confirmDialog(la.ARE_YOU_SURE_YOU_WANT_TO_DELETE_SELECTED_ITEMS, function(t) {
            if (t) {
                var a = {
                    cmd: "delete_selected_subaccounts",
                    items: e
                };
                $.ajax({
                    type: "POST",
                    url: "func/fn_settings.subaccounts.php",
                    data: a,
                    success: function(e) {
                        "OK" == e && settingsReloadSubaccounts()
                    }
                })
            }
        }) : notifyBox("error", la.ERROR, la.NO_ITEMS_SELECTED)
    }
}

function load() {
    if (isIE) {
        var e = '<div class="row">This application uses features that are unavailables in your browser.</div>';
        return e += '<div class="row">Please use one of these browsers:</div>', e += '<div class="row"><a href="http://www.mozilla.org/en-US/" target="_blank"><img style="border:0px" src="img/firefox.png" /></a>', e += "&nbsp;&nbsp;&nbsp;", e += '<a href="http://www.google.com/intl/en/chrome/browser/" target="_blank"><img style="border:0px" src="img/chrome.png" /></a></div>', void(document.getElementById("loading_panel_text").innerHTML = e)
    }
    loadLanguage(function(e) {
        loadSettings("server", function(e) {
            loadSettings("user", function(e) {
                loadSettings("cookies", function(e) {
                    loadSettings("object_groups", function(e) {
                        loadSettings("object_drivers", function(e) {
                            loadSettings("object_trailers", function(e) {
                                loadSettings("objects", function(e) {
                                    loadSettings("events", function(e) {
                                        loadSettings("templates", function(e) {
                                            loadSettings("subaccounts", function(e) {
                                                load2()
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

function load2() {
    if (initMap(), initGui(), initGrids(), initGraph(), objectLoadList(), objectLoadData(), eventsLoadData(), placesGroupLoadData(function(e) {
            placesMarkerLoadData(), placesRouteLoadData(), placesZoneLoadData()
        }), 1 == settingsUserData.privileges_reports && reportsLoadData(), 1 == settingsUserData.privileges_object_control && cmdTemplateLoadData(), 1 == settingsUserData.privileges_chat && chatLoadData(), 1 == settingsUserData.billing && billingLoadData(), "subuser" == settingsUserData.privileges) {
        $("#settings_main").tabs("option", "active", 4);
        var e;
        (e = document.getElementById("settings_main_objects")).parentNode.removeChild(e), (e = document.getElementById("settings_main_objects_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_events")).parentNode.removeChild(e), (e = document.getElementById("settings_main_events_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_templates")).parentNode.removeChild(e), (e = document.getElementById("settings_main_templates_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_sms")).parentNode.removeChild(e), (e = document.getElementById("settings_main_sms_tab")).parentNode.removeChild(e), (e = document.getElementById("settings_main_subaccounts")).parentNode.removeChild(e), (e = document.getElementById("settings_main_subaccounts_tab")).parentNode.removeChild(e), (e = document.getElementById("reports_generated")).parentNode.removeChild(e), (e = document.getElementById("reports_generated_tab")).parentNode.removeChild(e)
    } else 0 == settingsUserData.privileges_subaccounts && ((e = document.getElementById("settings_main_subaccounts")).parentNode.removeChild(e), (e = document.getElementById("settings_main_subaccounts_tab")).parentNode.removeChild(e));
    document.getElementById("loading_panel").style.display = "none", notifyCheck("expiring_objects"), notifyCheck("inactive_objects"), notifyCheck("session_check")
}

function unload() {
    settingsSaveCookies()
}

function objectLoadList() {
    var e = $("#side_panel_objects_object_list_grid");
    e.clearGridData(!0);
    for (var t in settingsObjectData) {
        var a = settingsObjectData[t];
        if ("true" == a.active) {
            var o = a.name.toLowerCase() + t.toLowerCase(),
                i = a.name.toLowerCase(),
                s = a.group_id,
                n = '<input id="object_visible_' + t + '" onClick="objectVisibleToggle(\'' + t + '\');" class="checkbox" type="checkbox"/>',
                l = '<input id="object_follow_' + t + '" onClick="objectFollowToggle(\'' + t + '\');" class="checkbox" type="checkbox"/>',
                r = '<a href="#"><img src="' + a.icon + '" style="width: 26px;"/></a>',
                d = '<div class="object-list-item"><div class="left"><div class="name">' + a.name + '</div><div class="status" id="object_status_' + t + '">' + la.NO_DATA + "</div></div>";
            d += '<div class="right"><div class="speed" id="object_speed_' + t + '">0 ' + la.UNIT_SPEED + "</div>", d += '<div class="engine" id="object_engine_' + t + '"></div>', d += '<div class="connection" id="object_connection_' + t + '">' + getConnectionIcon(0) + "</div></div></div>";
            var _ = '<div class="object-action-menu" id="object_action_menu_' + t + '" tag="' + t + '"><a href="#"><img src="theme/images/menu.svg" style="width: 4px;" title="' + la.ACTION + '"/></a></div>';
            e.jqGrid("addRowData", t, {
                search: o,
                name_sort: i,
                group_id: s,
                show: n,
                follow: l,
                icon: r,
                name: d,
                menu: _
            })
        }
    }
    e.setGridParam({
        sortname: "name_sort",
        sortorder: "asc"
    }).trigger("reloadGrid")
}

function objectReloadData() {
    objectsData = [], objectLoadList(), objectLoadData()
}

function objectLoadData() {
    clearTimeout(timer_objectLoadData);
    var e = {
        cmd: "load_object_data"
    };
    $.ajax({
        type: "POST",
        url: "func/fn_objects.php",
        data: e,
        dataType: "json",
        cache: !1,
        error: function(e, t) {
            timer_objectLoadData = setTimeout("objectLoadData();", 1e3 * gsValues.map_refresh)
        },
        success: function(e) {
            for (var t in e) e[t] = transformToObjectData(e[t]);
            if (Object.keys(objectsData).length != Object.keys(e).length) objectsData = e;
            else
                for (var t in e) objectsData[t].connection = e[t].connection, objectsData[t].status = e[t].status, objectsData[t].status_string = e[t].status_string, objectsData[t].odometer = e[t].odometer, objectsData[t].engine_hours = e[t].engine_hours, objectsData[t].service = e[t].service, "" == objectsData[t].data ? objectsData[t].data = e[t].data : (objectsData[t].data.length >= settingsObjectData[t].tail_points && objectsData[t].data.pop(), objectsData[t].data.unshift(e[t].data[0]), 1 == objectsData[t].selected && 1 == gsValues.map_street_view && utilsStreetView(objectsData[t].data[0].lat, objectsData[t].data[0].lng, objectsData[t].data[0].angle)), settingsObjectData[t].protocol = e[t].protocol, settingsObjectData[t].odometer = e[t].odometer, settingsObjectData[t].engine_hours = Math.floor(e[t].engine_hours / 60 / 60);
            objectUpdateList(), objectAddAllToMap(), "fit" == settingsUserData.map_sp && 0 == gsValues.map_fit_objects_finished && (fitObjectsOnMap(), gsValues.map_fit_objects_finished = !0), objectFollow(), timer_objectLoadData = setTimeout("objectLoadData();", 1e3 * gsValues.map_refresh)
        }
    })
}

function objectUpdateList() {
    for (var e in objectsData) {
        if ("" != objectsData[e].data) {
            if (null != document.getElementById("object_status_" + e)) {
                document.getElementById("object_visible_" + e).checked = objectsData[e].visible, document.getElementById("object_follow_" + e).checked = objectsData[e].follow;
                var t = objectsData[e].status_string;
                "server" == settingsUserData.od ? document.getElementById("object_status_" + e).innerHTML = objectsData[e].data[0].dt_server : "status" == settingsUserData.od && "" != t ? document.getElementById("object_status_" + e).innerHTML = t : document.getElementById("object_status_" + e).innerHTML = objectsData[e].data[0].dt_tracker, document.getElementById("object_speed_" + e).innerHTML = objectsData[e].data[0].speed + " " + la.UNIT_SPEED;
                var a = getSensorFromType(e, "acc");
                0 == a || 0 == objectsData[e].connection ? document.getElementById("object_engine_" + e).innerHTML = "" : 1 == getSensorValue(objectsData[e].data[0].params, a[0]).value ? document.getElementById("object_engine_" + e).innerHTML = getEngineIcon(1) : document.getElementById("object_engine_" + e).innerHTML = getEngineIcon(0), document.getElementById("object_connection_" + e).innerHTML = getConnectionIcon(objectsData[e].connection), 1 == objectsData[e].selected && showExtraData("object", e, objectsData[e].data[0])
            }
        } else null != document.getElementById("object_status_" + e) && (document.getElementById("object_visible_" + e).checked = objectsData[e].visible, document.getElementById("object_follow_" + e).checked = objectsData[e].follow, document.getElementById("object_status_" + e).innerHTML = la.NO_DATA, document.getElementById("object_speed_" + e).innerHTML = "0 " + la.UNIT_SPEED, document.getElementById("object_engine_" + e).innerHTML = "", document.getElementById("object_connection_" + e).innerHTML = getConnectionIcon(objectsData[e].connection));
        objectSetListStatus(e, objectsData[e].status, objectsData[e].event_ohc_color)
    }
    for (var o in settingsObjectGroupData) null != document.getElementById("object_group_visible_" + o) && (document.getElementById("object_group_visible_" + o).checked = settingsObjectGroupData[o].visible), null != document.getElementById("object_group_follow_" + o) && (document.getElementById("object_group_follow_" + o).checked = settingsObjectGroupData[o].follow)
}

function objectSetListStatus(e, t, a) {
    var o = getObjectListColor(t, a),
        i = $("#side_panel_objects_object_list_grid");
    $(i).jqGrid("setRowData", e, !1, {
        background: o
    })
}

function objectAddAllToMap() {
    var e = document.getElementById("side_panel_objects_object_list_search").value;
    objectRemoveAllFromMap();
    for (var t in objectsData) "true" == settingsObjectData[t].active && strMatches(settingsObjectData[t].name, e) && (objectAddToMap(t), objectVisible(t))
}

function objectRemoveAllFromMap() {
    mapLayers.realtime.clearLayers()
}

function objectSetStatusEvent(e, t, a) {
    if (void 0 != objectsData[e])
        if (0 == t && 0 == a) {
            if (objectsData[e].event = !1, objectsData[e].event_arrow_color = !1, objectsData[e].event_ohc_color = !1, "arrow" == settingsObjectData[e].map_icon) {
                var o = objectsData[e].data[0].speed,
                    i = objectsData[e].status,
                    s = getMarkerIcon(e, o, i, !1);
                objectsData[e].layers.marker.setIcon(s)
            }
            objectSetListStatus(e, objectsData[e].status, !1)
        } else {
            if (objectsData[e].event = !0, objectsData[e].event_arrow_color = t, objectsData[e].event_ohc_color = a, "arrow" == settingsObjectData[e].map_icon) {
                var o = objectsData[e].data[0].speed,
                    i = objectsData[e].status,
                    s = getMarkerIcon(e, o, i, t);
                objectsData[e].layers.marker.setIcon(s)
            }
            objectSetListStatus(e, i, a)
        }
}

function objectAddToMap(e) {
    var t = settingsObjectData[e].name;
    if ("" != objectsData[e].data) var a = objectsData[e].data[0].lat,
        o = objectsData[e].data[0].lng,
        i = objectsData[e].data[0].altitude,
        s = objectsData[e].data[0].angle,
        n = objectsData[e].data[0].speed,
        l = objectsData[e].data[0].dt_tracker,
        r = objectsData[e].data[0].params;
    else var a = 0,
        o = 0,
        n = 0,
        r = !1;
    var d = settingsUserData.map_is,
        _ = s;
    "arrow" != settingsObjectData[e].map_icon && (_ = 0);
    var c = objectsData[e].status,
        g = objectsData[e].event_arrow_color,
        m = getMarkerIcon(e, n, c, g),
        u = L.marker([a, o], {
            icon: m,
            iconAngle: _
        }),
        p = t + " (" + n + " " + la.UNIT_SPEED + ")";
    u.bindTooltip(p, {
        permanent: !0,
        offset: [20 * d, 0],
        direction: "right"
    }).openTooltip(), u.on("click", function(_) {
        objectSelect(e), "" != objectsData[e].data && geocoderGetAddress(a, o, function(_) {
            var c = _,
                g = urlPosition(a, o),
                m = "",
                u = "",
                p = "",
                y = new Array;
            for (var v in settingsObjectData[e].sensors) y.push(settingsObjectData[e].sensors[v]);
            var b = sortArrayByElement(y, "name");
            for (var v in b) {
                var E = b[v];
                if ("true" == E.popup) {
                    var h = getSensorValue(r, E);
                    m += "<tr><td><strong>" + E.name + ":</strong></td><td>" + h.value_full + "</td></tr>"
                }
            }
            var f = new Array;
            for (var v in settingsObjectData[e].custom_fields) f.push(settingsObjectData[e].custom_fields[v]);
            var I = sortArrayByElement(f, "name");
            for (var v in I) {
                var D = I[v];
                "true" == D.popup && (u += "<tr><td><strong>" + D.name + ":</strong></td><td>" + D.value + "</td></tr>")
            }
            var B = new Array;
            for (var v in objectsData[e].service) B.push(objectsData[e].service[v]);
            var O = sortArrayByElement(B, "name");
            for (var v in O) "true" == O[v].popup && (p += "<tr><td><strong>" + O[v].name + ":</strong></td><td>" + O[v].status + "</td></tr>");
            var j = "<table>\t\t\t\t\t<tr><td><strong>" + la.OBJECT + ":</strong></td><td>" + t + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + c + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + g + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ALTITUDE + ":</strong></td><td>" + i + " " + la.UNIT_HEIGHT + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.ANGLE + ":</strong></td><td>" + s + " &deg;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.SPEED + ":</strong></td><td>" + n + " " + la.UNIT_SPEED + "</td></tr>\t\t\t\t\t<tr><td><strong>" + la.TIME + ":</strong></td><td>" + l + "</td></tr>",
                R = getObjectOdometer(e, !1); - 1 != R && (j += "<tr><td><strong>" + la.ODOMETER + ":</strong></td><td>" + R + " " + la.UNIT_DISTANCE + "</td></tr>");
            var T = getObjectEngineHours(e, !1); - 1 != T && (j += "<tr><td><strong>" + la.ENGINE_HOURS + ":</strong></td><td>" + T + "</td></tr>");
            var k = j + m + u + p;
            addPopupToMap(a, o, [0, -14 * d], j += "</table>", k += "</table>")
        })
    }), u.on("add", function(t) {
        0 == gsValues.map_object_labels && u.closeTooltip(), objectAddTailToMap(e)
    }), u.on("remove", function(t) {
        void 0 != objectsData[e] && objectsData[e].layers.tail && mapLayers.realtime.removeLayer(objectsData[e].layers.tail)
    }), mapLayers.realtime.addLayer(u), objectsData[e].layers.marker = u
}

function objectAddTailToMap(e) {
    if (settingsObjectData[e].tail_points > 0) {
        objectsData[e].layers.tail && mapLayers.realtime.removeLayer(objectsData[e].layers.tail);
        var t, a = new Array;
        for (t = 0; t < objectsData[e].data.length; t++) {
            var o = objectsData[e].data[t].lat,
                i = objectsData[e].data[t].lng;
            a.push(L.latLng(o, i))
        }
        var s = L.polyline(a, {
            color: settingsObjectData[e].tail_color,
            opacity: .8,
            weight: 3
        });
        mapLayers.realtime.addLayer(s), objectsData[e].layers.tail = s
    }
}

function objectGroupVisibleToggle(e) {
    var t = document.getElementById("object_group_visible_" + e).checked;
    for (var a in settingsObjectData) settingsObjectData[a].group_id == e && (settingsObjectGroupData[e].visible = t, null != document.getElementById("object_visible_" + a) && (document.getElementById("object_visible_" + a).checked = t, objectsData[a].visible = t, objectVisible(a)))
}

function objectVisibleToggle(e) {
    var t = document.getElementById("object_visible_" + e).checked;
    objectsData[e].visible = t, objectVisible(e)
}

function objectVisible(e) {
    1 == objectsData[e].visible ? mapLayers.realtime.addLayer(objectsData[e].layers.marker) : mapLayers.realtime.removeLayer(objectsData[e].layers.marker)
}

function objectVisibleAllToggle() {
    objectVisibleAll(1 == gsValues.objects_visible ? !1 : !0)
}

function objectVisibleAll(e) {
    gsValues.objects_visible = e;
    for (var t in objectsData) objectsData[t].visible = e, null != document.getElementById("object_visible_" + t) && (document.getElementById("object_visible_" + t).checked = e), objectVisible(t);
    for (var a in settingsObjectGroupData) null != document.getElementById("object_group_visible_" + a) && (settingsObjectGroupData[a].visible = e, document.getElementById("object_group_visible_" + a).checked = e)
}

function objectGroupFollowToggle(e) {
    var t = document.getElementById("object_group_follow_" + e).checked;
    for (var a in settingsObjectData) settingsObjectData[a].group_id == e && (settingsObjectGroupData[e].follow = t, null != document.getElementById("object_follow_" + a) && (document.getElementById("object_follow_" + a).checked = t, objectsData[a].follow = t));
    objectFollow()
}

function objectFollowToggle(e) {
    var t = document.getElementById("object_follow_" + e).checked;
    objectsData[e].follow = t, objectFollow()
}

function objectFollow() {
    var e = document.getElementById("side_panel_objects_object_list_search").value,
        t = 0,
        a = new Array;
    for (var o in objectsData)
        if (strMatches(settingsObjectData[o].name, e) && "" != objectsData[o].data && 1 == objectsData[o].follow) {
            var i = objectsData[o].data[0].lat,
                s = objectsData[o].data[0].lng;
            a.push([i, s]), t += 1
        } t > 1 ? map.fitBounds(a) : 1 == t && map.panTo({
        lat: i,
        lng: s
    })
}

function objectFollowAllToggle() {
    objectFollowAll(1 == gsValues.objects_follow ? !1 : !0)
}

function objectFollowAll(e) {
    gsValues.objects_follow = e;
    for (var t in objectsData) objectsData[t].follow = e, null != document.getElementById("object_follow_" + t) && (document.getElementById("object_follow_" + t).checked = e);
    for (var a in settingsObjectGroupData) null != document.getElementById("object_group_follow_" + a) && (settingsObjectGroupData[a].follow = e, document.getElementById("object_group_follow_" + a).checked = e);
    objectFollow()
}

function objectPanToZoom(e) {
    if ("" != objectsData[e].data) {
        var t = objectsData[e].data[0].lat,
            a = objectsData[e].data[0].lng;
        map.setView([t, a], 15)
    }
}

function objectPanTo(e) {
    if ("" != objectsData[e].data) {
        var t = objectsData[e].data[0].lat,
            a = objectsData[e].data[0].lng;
        map.panTo({
            lat: t,
            lng: a
        })
    }
}

function objectSelect(e) {
    objectUnSelectAll(), 0 != objectsData[e].event && objectSetStatusEvent(e, !1, !1), "" != objectsData[e].data ? (objectsData[e].selected = !0, showExtraData("object", e, objectsData[e].data[0]), 1 == gsValues.map_street_view && utilsStreetView(objectsData[e].data[0].lat, objectsData[e].data[0].lng, objectsData[e].data[0].angle)) : (notifyBox("info", la.INFORMATION, la.NO_DATA_HAS_BEEN_RECEIVED_YET), showExtraData("object", e, ""))
}

function objectUnSelectAll() {
    for (var e in objectsData) objectsData[e].selected = !1
}

function utilsCheckPrivileges(e) {
    switch (e) {
        case "viewer":
            if (("" == settingsUserData.privileges || "viewer" == settingsUserData.privileges) && 0 == settingsUserData.cpanel_privileges) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "subuser":
            if ("subuser" == settingsUserData.privileges) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "obj_add":
            if (0 != settingsUserData.manager_id || "false" == settingsUserData.obj_add) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "obj_history_clear":
            if ("true" != settingsUserData.obj_history_clear) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "obj_edit":
            if ("true" != settingsUserData.obj_edit) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "history":
            if (1 != settingsUserData.privileges_history) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "reports":
            if (1 != settingsUserData.privileges_reports) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "rilogbook":
            if (1 != settingsUserData.privileges_rilogbook) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "dtc":
            if (1 != settingsUserData.privileges_dtc) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "object_control":
            if (1 != settingsUserData.privileges_object_control) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "image_gallery":
            if (1 != settingsUserData.privileges_image_gallery) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "chat":
            if (1 != settingsUserData.privileges_chat) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1;
            break;
        case "subaccounts":
            if (1 != settingsUserData.privileges_subaccounts) return notifyBox("error", la.ERROR, la.THIS_ACCOUNT_HAS_NO_PRIVILEGES_TO_DO_THAT), !1
    }
    return !0
}

function utilsArea() {
    0 == utilsAreaData.enabled ? 1 != gsValues.map_bussy && (utilsAreaData.area_layer = map.editTools.startPolygon(), map.on("editable:drawing:end", function(e) {
        if (!(utilsAreaData.area_layer.getLatLngs()[0].length < 3)) {
            var t = getAreaFromLatLngs(utilsAreaData.area_layer.getLatLngs()[0]);
            if ("km" == settingsUserData.unit_distance) {
                a = 1e-6 * t;
                a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_KM
            } else {
                var a = 1e-6 * t * .386102;
                a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_MI
            }
            var o = 1e-4 * t,
                i = a + "</br>" + (o = (o = Math.round(100 * o) / 100) + " " + la.UNIT_HECTARES);
            utilsAreaData.area_layer.bindTooltip(i, {
                permanent: !0,
                direction: "center"
            }).openTooltip(), map.on("editable:editing editable:drag", function(e) {
                var t = getAreaFromLatLngs(utilsAreaData.area_layer.getLatLngs()[0]);
                if ("km" == settingsUserData.unit_distance) {
                    a = 1e-6 * t;
                    a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_KM
                } else {
                    var a = 1e-6 * t * .386102;
                    a = (a = Math.round(100 * a) / 100) + " " + la.UNIT_SQ_MI
                }
                var o = 1e-4 * t,
                    i = a + "</br>" + (o = (o = Math.round(100 * o) / 100) + " " + la.UNIT_HECTARES);
                utilsAreaData.area_layer.setTooltipContent(i), utilsAreaData.area_layer.openTooltip()
            }), map.off("editable:drawing:end")
        }
    }), utilsAreaData.enabled = !0, gsValues.map_bussy = !0, map.doubleClickZoom.disable()) : (map.editTools.stopDrawing(), 1 == map.hasLayer(utilsAreaData.area_layer) && map.removeLayer(utilsAreaData.area_layer), map.off("editable:editing editable:drag"), utilsAreaData.enabled = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable())
}

function utilsRuler() {
    0 == utilsRulerData.enabled ? 1 != gsValues.map_bussy && (utilsRulerData.line_layer = map.editTools.startPolyline(), map.on("editable:editing editable:drag", function(e) {
        var t = utilsRulerData.line_layer.getLatLngs(),
            a = t[t.length - 1];
        if (map.hasLayer(utilsRulerData.label_layer)) {
            var o = getLengthFromLatLngs(t);
            o = (o = convDistanceUnits(o, "km", settingsUserData.unit_distance)).toFixed(2), o += " " + la.UNIT_DISTANCE, utilsRulerData.label_layer.setLatLng(a), utilsRulerData.label_layer.setContent(o)
        } else utilsRulerData.label_layer = L.tooltip({
            permanent: !0,
            offset: [10, 0],
            direction: "right"
        }), utilsRulerData.label_layer.setLatLng(a), utilsRulerData.label_layer.setContent("0 " + la.UNIT_DISTANCE), map.addLayer(utilsRulerData.label_layer)
    }), utilsRulerData.enabled = !0, gsValues.map_bussy = !0, map.doubleClickZoom.disable()) : (map.editTools.stopDrawing(), 1 == map.hasLayer(utilsRulerData.line_layer) && map.removeLayer(utilsRulerData.line_layer), 1 == map.hasLayer(utilsRulerData.label_layer) && map.removeLayer(utilsRulerData.label_layer), map.off("editable:editing editable:drag"), utilsRulerData.enabled = !1, gsValues.map_bussy = !1, map.doubleClickZoom.enable())
}

function utilsShowDriverInfo(e) {
    var t = settingsObjectDriverData[e].name,
        a = settingsObjectDriverData[e].idn,
        o = settingsObjectDriverData[e].address,
        i = settingsObjectDriverData[e].phone,
        s = settingsObjectDriverData[e].email,
        n = settingsObjectDriverData[e].desc,
        l = settingsObjectDriverData[e].img;
    l = '<center><img style="border:0px; width: 80px;" src="' + (l = "" == l ? "img/user-blank.svg" : "data/user/drivers/" + l) + '" /></center>', text = '<div class="row">', text += '<div class="row2"><div class="width40">' + l + '</div><div class="width60">' + t + "</div></div>", "" != a && (text += '<div class="row2"><div class="width40"><strong>' + la.ID_NUMBER + ':</strong></div><div class="width60">' + a + "</div></div>"), "" != o && (text += '<div class="row2"><div class="width40"><strong>' + la.ADDRESS + ':</strong></div><div class="width60">' + o + "</div></div>"), "" != i && (text += '<div class="row2"><div class="width40"><strong>' + la.PHONE + ':</strong></div><div class="width60">' + i + "</div></div>"), "" != s && (s = '<a href="mailto:' + s + '">' + s + "</a>", text += '<div class="row2"><div class="width40"><strong>' + la.EMAIL + ':</strong></div><div class="width60">' + s + "</div></div>"), "" != n && (text += '<div class="row2"><div class="width40"><strong>' + la.DESCRIPTION + ':</strong></div><div class="width60">' + n + "</div></div>"), text += "</div>", notifyBox("info", la.DRIVER_INFO, text)
}

function utilsShowTrailerInfo(e) {
    var t = settingsObjectTrailerData[e].name,
        a = settingsObjectTrailerData[e].model,
        o = settingsObjectTrailerData[e].vin,
        i = settingsObjectTrailerData[e].plate_number,
        s = settingsObjectTrailerData[e].desc;
    text = '<div class="row">', text += '<div class="row2"><div class="width40"><strong>' + la.NAME + ':</strong></div><div class="width60">' + t + "</div></div>", "" != a && (text += '<div class="row2"><div class="width40"><strong>' + la.MODEL + ':</strong></div><div class="width60">' + a + "</div></div>"), "" != o && (text += '<div class="row2"><div class="width40"><strong>' + la.VIN + ':</strong></div><div class="width60">' + o + "</div></div>"), "" != i && (text += '<div class="row2"><div class="width40"><strong>' + la.PLATE_NUMBER + ':</strong></div><div class="width60">' + i + "</div></div>"), "" != s && (text += '<div class="row2"><div class="width40"><strong>' + la.DESCRIPTION + ':</strong></div><div class="width60">' + s + "</div></div>"), text += "</div>", notifyBox("info", la.TRAILER_INFO, text)
}

function utilsShowPassengerInfo(e) {
    var t = {
        cmd: "load_object_passenger_data",
        passenger_id: e
    };
    $.ajax({
        type: "POST",
        url: "func/fn_settings.passengers.php",
        data: t,
        dataType: "json",
        cache: !1,
        success: function(e) {
            var t = e.name,
                a = e.idn,
                o = e.address,
                i = e.phone,
                s = e.email,
                n = e.desc;
            text = '<div class="row">', text += '<div class="row2"><div class="width40"><strong>' + la.NAME + ':</strong></div><div class="width60">' + t + "</div></div>", "" != a && (text += '<div class="row2"><div class="width40"><strong>' + la.ID_NUMBER + ':</strong></div><div class="width60">' + a + "</div></div>"), "" != o && (text += '<div class="row2"><div class="width40"><strong>' + la.ADDRESS + ':</strong></div><div class="width60">' + o + "</div></div>"), "" != i && (text += '<div class="row2"><div class="width40"><strong>' + la.PHONE + ':</strong></div><div class="width60">' + i + "</div></div>"), "" != s && (s = '<a href="mailto:' + s + '">' + s + "</a>", text += '<div class="row2"><div class="width40"><strong>' + la.EMAIL + ':</strong></div><div class="width60">' + s + "</div></div>"), "" != n && (text += '<div class="row2"><div class="width40"><strong>' + la.DESCRIPTION + ':</strong></div><div class="width60">' + n + "</div></div>"), text += "</div>", notifyBox("info", la.PASSENGER_INFO, text)
        }
    })
}

function utilsShowPoint() {
    utilsPointOnMap(document.getElementById("dialog_show_point_lat").value, document.getElementById("dialog_show_point_lng").value)
}

function utilsPointOnMap(e, t) {
    "" == e && (e = 0), "" == t && (t = 0), geocoderGetAddress(e, t, function(a) {
        var o = a,
            i = urlPosition(e, t),
            s = "<table>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + o + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + i + "</td></tr>\t\t\t\t\t</table>";
        addPopupToMap(e, t, [0, 0], s, ""), map.panTo({
            lat: e,
            lng: t
        }), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(e, t, 0))
    })
}

function utilsSearchAddress() {
    var e = document.getElementById("Or").value;
    geocoderGetLocation(e, function(t) {
        if (void 0 != t[0].address) {
            e = t[0].address;
            var a = t[0].lat,
                o = t[0].lng,
                i = urlPosition(a, o);
            addPopupToMap(a, o, [0, 0], "<table>\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + e + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + i + "</td></tr>\t\t\t\t\t</table>", ""), map.panTo({
                lat: a,
                lng: o
            }), 1 == gsValues.map_street_view && (objectUnSelectAll(), utilsStreetView(a, o, 0))
        } else notifyBox("info", la.INFORMATION, la.NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST)
    })
}

function utilsFollowObject(e, t) {
    if ("" != objectsData[e].data) {
        var a = document.getElementById("map_layer").value,
            o = "func/fn_object.follow.php?imei=" + e + "&map_layer=" + a;
        if (1 == t) window.open(o, "_blank");
        else if (void 0 == utilsFollowObjectData[e]) {
            var i = '<div style="position:absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;">';
            i += '<iframe src="' + o + '" style="border: 0px; width: 100%; height: 100%;"></iframe>', i += "</div>";
            var s = settingsObjectData[e].name,
                n = $(document.createElement("div"));
            n.attr("title", la.FOLLOW + " (" + s + ")"), n.html(i), $(n).dialog({
                autoOpen: !1,
                width: 500,
                height: 400,
                minWidth: 350,
                minHeight: 250,
                resizable: !0,
                close: function(t, a) {
                    utilsFollowObjectData[e] = void 0
                }
            }), $(n).dialog("open"), utilsFollowObjectData[e] = new Array, utilsFollowObjectData[e].dialog = n
        } else utilsFollowObjectData[e].dialog.dialog("moveToTop")
    } else notifyBox("info", la.INFORMATION, la.NO_DATA_HAS_BEEN_RECEIVED_YET)
}

function utilsRouteToPoint(e) {
    if (1 != gsValues.map_bussy) {
        utilsRouteToPointHide();
        var t = settingsUserData.map_is,
            a = !1;
        for (var o in objectsData)
            if (1 == objectsData[o].selected) {
                a = o;
                break
            } if (0 == a) notifyBox("info", la.INFORMATION, la.NO_OBJECT_SELECTED);
        else {
            var i = new Array;
            if ("" != objectsData[a].data) {
                var s = objectsData[a].data[0].lat,
                    n = objectsData[a].data[0].lng;
                i.push(L.latLng(s, n)), i.push(e);
                var l = L.Routing.control({
                    waypoints: i,
                    show: !1,
                    showAlternatives: !1,
                    waypointMode: "snap",
                    createMarker: function() {}
                }).addTo(map);
                l.on("routeselected", function(e) {
                    utilsRouteToPointData.route_points = e.route.coordinates;
                    var a = L.polyline(utilsRouteToPointData.route_points, {
                        color: settingsUserData.map_rc,
                        opacity: .8,
                        weight: 3
                    });
                    mapLayers.utils.addLayer(a), map.removeControl(l);
                    var o = getLengthFromLatLngs(utilsRouteToPointData.route_points);
                    o = convDistanceUnits(o, "km", settingsUserData.unit_distance), o = o.toFixed(2), o += " " + la.UNIT_DISTANCE;
                    var i = getTimeDetails(Math.floor(e.route.summary.totalTime), !0),
                        s = utilsRouteToPointData.route_points[0].lat,
                        n = utilsRouteToPointData.route_points[0].lng,
                        r = L.marker([s, n], {
                            icon: mapMarkerIcons.route_start
                        });
                    r.on("click", function(e) {
                        geocoderGetAddress(s, n, function(e) {
                            var a = e,
                                l = urlPosition(s, n),
                                r = "<table>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + a + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + l + "</td></tr>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.LENGTH + ":</strong></td><td>" + o + "</td></tr>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.DURATION + ":</strong></td><td>" + i + "</td></tr>\t\t\t\t\t\t\t\t</table>";
                            r += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="utilsRouteToPointSave();">' + la.SAVE_AS_ROUTE + "</a> " + la.OR, r += ' <a href="#" class="" onClick="utilsRouteToPointHide();">' + la.HIDE.toLowerCase() + "</a></div>", addPopupToMap(s, n, [0, -28 * t], r, "")
                        })
                    }), mapLayers.utils.addLayer(r);
                    var d = utilsRouteToPointData.route_points[utilsRouteToPointData.route_points.length - 1].lat,
                        _ = utilsRouteToPointData.route_points[utilsRouteToPointData.route_points.length - 1].lng;
                    (r = L.marker([d, _], {
                        icon: mapMarkerIcons.route_end
                    })).on("click", function(e) {
                        geocoderGetAddress(d, _, function(e) {
                            var a = e,
                                s = urlPosition(d, _),
                                n = "<table>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.ADDRESS + ":</strong></td><td>" + a + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.POSITION + ":</strong></td><td>" + s + "</td></tr>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.LENGTH + ":</strong></td><td>" + o + "</td></tr>\t\t\t\t\t\t\t\t<tr><td><strong>" + la.DURATION + ":</strong></td><td>" + i + "</td></tr>\t\t\t\t\t\t\t\t</table>";
                            n += '<div style="width:100%; text-align: right;"><a href="#" class="" onClick="utilsRouteToPointSave();">' + la.SAVE_AS_ROUTE + "</a> " + la.OR, n += ' <a href="#" class="" onClick="utilsRouteToPointHide();">' + la.HIDE.toLowerCase() + "</a></div>", addPopupToMap(d, _, [0, -28 * t], n, "")
                        })
                    });
                    var c = a.getBounds();
                    map.fitBounds(c), mapLayers.utils.addLayer(r)
                })
            }
        }
    }
}

function utilsRouteToPointSave() {
    if (1 != gsValues.map_bussy) {
        var e = Math.ceil(utilsRouteToPointData.route_points.length / 200),
            t = new Array;
        for (i = 0; i < utilsRouteToPointData.route_points.length; i += e) {
            var a = utilsRouteToPointData.route_points[i].lat,
                o = utilsRouteToPointData.route_points[i].lng;
            t.push(L.latLng(a, o))
        }
        placesRouteSave(t), utilsRouteToPointHide()
    }
}

function utilsRouteToPointHide() {
    utilsRouteToPointData.route_points = !1, mapLayers.utils.clearLayers(), destroyMapPopup()
}

function utilsStreetView(e, t, a) {
    if (e != utilsStreetViewData.prev_lat && t != utilsStreetViewData.prev_lng) {
        var o = {
            lat: e,
            lng: t,
            angle: a
        };
        $.ajax({
            type: "POST",
            url: "func/fn_streetview.php",
            data: o,
            cache: !1,
            success: function(a) {
                if ("" == a) document.getElementById("street_view_control").innerHTML = la.STREET_VIEW;
                else {
                    var o = "data:image/jpg;base64," + a;
                    document.getElementById("street_view_control").innerHTML = '<a href="#" onClick="utilsStreetViewPoint(' + e + ", " + t + ', true);"><img src="' + o + '"/></a>'
                }
            }
        }), utilsStreetViewData.prev_lat = e, utilsStreetViewData.prev_lng = t
    }
}

function utilsStreetViewObject(e, t) {
    if ("" != objectsData[e].data) {
        var a = "http://maps.google.com/maps?q=&layer=c&cbll=" + objectsData[e].data[0].lat + "," + objectsData[e].data[0].lng;
        1 == t && window.open(a, "_blank")
    } else notifyBox("info", la.INFORMATION, la.NO_DATA_HAS_BEEN_RECEIVED_YET)
}

function utilsStreetViewPoint(e, t, a) {
    var o = "http://maps.google.com/maps?q=&layer=c&cbll=" + e + "," + t;
    1 == a && window.open(o, "_blank")
}
var billingData = new Array;
billingData.plan = new Array;
var timer_billingLoadData, chatData = new Array;
chatData.imei = !1, chatData.first_msg_id = !1, chatData.last_msg_id = !1, chatData.msg_count = new Array;
var timer_chatLoadData, timer_chatMsgsDTHide, chatMsgsScrollHandler = function() {
        0 == $(this).scrollTop() && 0 != chatData.first_msg_id && chatLoadMsgs("old"), $("#chat_msgs div").each(function() {
            if ($(this).position().top > 0) {
                var e = $(this).attr("title");
                if (void 0 != e && e.length > 10) return "none" == document.getElementById("chat_msgs_dt").style.display && (document.getElementById("chat_msgs_dt").style.display = "block"), clearTimeout(timer_chatMsgsDTHide), timer_chatMsgsDTHide = setTimeout(function() {
                    $("#chat_msgs_dt").fadeOut("slow")
                }, 3e3), document.getElementById("chat_msgs_dt").innerHTML = e.substring(0, 10), !1
            }
        })
    },
    timer_imgLoadData, cmdData = new Array;
cmdData.cmd_templates = new Array, cmdData.edit_cmd_schedule_id = !1, cmdData.edit_cmd_template_id = !1;
var timer_cmdLoadData, eventsData = new Array;
eventsData.last_id = -1, eventsData.events_loaded = !1;
var timer_eventsLoadData, guiDragbarObjectsHandler = function(e) {
        $("#map").css("pointer-events", "none"), resizeGridObjects(e.pageY)
    },
    guiDragbarEventsHandler = function(e) {
        $("#map").css("pointer-events", "none"), resizeGridEvents(e.pageY)
    },
    guiDragbarHistoryHandler = function(e) {
        $("#map").css("pointer-events", "none"), resizeGridHistory(e.pageY)
    },
    guiDragbarBottomPanelHandler = function(e) {
        "block" == document.getElementById("bottom_panel").style.display && ($("#map").css("pointer-events", "none"), resizeBottomPanel(e.pageY))
    };
$.pnotify.defaults.history = !1, $.pnotify.defaults.styling = "jqueryui";
var confirmResponseValue = !1,
    historyRouteData = new Array,
    historyGraphPlot, historyRouteToggle = new Array;
historyRouteToggle.route = !0, historyRouteToggle.snap = !1, historyRouteToggle.arrows = !1, historyRouteToggle.data_points = !1, historyRouteToggle.stops = !0, historyRouteToggle.events = !0;
var timer_historyRoutePlay, reportsData = new Array;
reportsData.reports = new Array, reportsData.edit_report_id = !1, reportsData.data_items = new Array, reportsData.data_items.general = ["route_start", "route_end", "route_length", "move_duration", "stop_duration", "stop_count", "top_speed", "avg_speed", "overspeed_count", "fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "odometer", "engine_hours", "driver", "trailer"], reportsData.data_items.general_merged = ["route_start", "route_end", "route_length", "move_duration", "stop_duration", "stop_count", "top_speed", "avg_speed", "overspeed_count", "fuel_consumption", "fuel_cost", "engine_work", "engine_idle", "odometer", "engine_hours", "driver", "trailer", "total"], reportsData.data_items.object_info = ["imei", "transport_model", "vin", "plate_number", "odometer", "engine_hours", "driver", "trailer", "gps_device", "sim_card_number"], reportsData.data_items.current_position = ["time", "position", "speed", "altitude", "angle", "status", "odometer", "engine_hours"], reportsData.data_items.current_position_off = ["time", "position", "speed", "altitude", "angle", "status", "odometer", "engine_hours"], reportsData.data_items.drives_stops = ["status", "start", "end", "duration", "move_duration", "stop_duration", "route_length", "top_speed", "avg_speed", "fuel_consumption", "fuel_cost", "engine_work", "engine_idle"], reportsData.data_items.travel_sheet = ["time_a", "position_a", "time_b", "position_b", "duration", "route_length", "fuel_consumption", "fuel_cost", "total"], reportsData.data_items.mileage_daily = ["time", "start", "end", "route_length", "fuel_consumption", "fuel_cost", "total"], reportsData.data_items.overspeed = ["start", "end", "duration", "top_speed", "avg_speed", "overspeed_position"], reportsData.data_items.overspeedT = ["start", "end", "duration", "top_speed", "avg_speed", "overspeed_position"], reportsData.data_items.underspeed = ["start", "end", "duration", "top_speed", "avg_speed", "underspeed_position"], reportsData.data_items.zone_in_out = ["zone_in", "zone_out", "duration", "route_length", "zone_name", "zone_position"], reportsData.data_items.events = ["time", "event", "event_position", "total"], reportsData.data_items.service = ["service", "last_service", "status"], reportsData.data_items.rag = ["overspeed_score", "harsh_acceleration_score", "harsh_braking_score", "harsh_cornering_score"], reportsData.data_items.rilogbook = ["group", "name", "position"], reportsData.data_items.dtc = ["code", "position"], reportsData.data_items.logic_sensors = ["sensor", "activation_time", "deactivation_time", "duration", "activation_position", "deactivation_position"], reportsData.data_items.acc_graph = [], reportsData.data_items.apeed_graph = [], reportsData.data_items.altitude_graph = [], reportsData.data_items.fuellevel_graph = [], reportsData.data_items.fuelfillings = ["time", "position", "before", "after", "filled", "sensor", "driver", "total"], reportsData.data_items.fuelthefts = ["time", "position", "before", "after", "stolen", "sensor", "driver", "total"], reportsData.data_items.temperature_graph = [], reportsData.data_items.sensor_graph = [];
var timer_sessionCheck, placesGroupData = new Array;
placesGroupData.groups = new Array, placesGroupData.edit_group_id = !1;
var placesMarkerData = new Array;
placesMarkerData.markers = new Array, placesMarkerData.default_icons_loaded = !1, placesMarkerData.custom_icons_loaded = !1, placesMarkerData.marker_icon = "img/markers/places/pin-1.svg", placesMarkerData.new_marker_id = 1, placesMarkerData.edit_marker_id = !1, placesMarkerData.edit_marker_layer = !1;
var placesZoneData = new Array;
placesZoneData.zones = new Array, placesZoneData.new_zone_id = 1, placesZoneData.edit_zone_id = !1, placesZoneData.edit_zone_layer = !1;
var placesRouteData = new Array;
placesRouteData.routes = new Array, placesRouteData.new_route_id = 1, placesRouteData.edit_route_id = !1, placesRouteData.edit_route_layer = !1, placesRouteData.edit_start_label_layer = !1, placesRouteData.edit_end_label_layer = !1;
var settingsEditData = new Array,
    settingsUserData = new Array,
    settingsObjectData = new Array,
    settingsObjectGroupData = new Array,
    settingsObjectDriverData = new Array,
    settingsObjectTrailerData = new Array,
    settingsEventData = new Array,
    settingsTemplateData = new Array,
    settingsSubaccountData = new Array;
settingsEditData.object_icon = !1, settingsEditData.object_imei = !1, settingsEditData.object_duplicate_imei = !1, settingsEditData.sensor_id = !1, settingsEditData.sensor_calibration = new Array, settingsEditData.service_id = !1, settingsEditData.custom_field_id = !1, settingsEditData.group_id = !1, settingsEditData.driver_id = !1, settingsEditData.driver_img_file = !1, settingsEditData.passenger_id = !1, settingsEditData.trailer_id = !1, settingsEditData.event_id = !1, settingsEditData.event_condition = new Array, settingsEditData.template_id = !1, settingsEditData.subaccount_id = !1, settingsEditData.subaccount_au = !1, settingsEditData.default_icons_loaded = !1, settingsEditData.custom_icons_loaded = !1, gsValues.title = document.title, gsValues.map_fit_objects_finished = !1, gsValues.map_objects = !0, gsValues.map_object_labels = !0, gsValues.map_markers = !0, gsValues.map_routes = !0, gsValues.map_zones = !0, gsValues.map_clusters = !0, gsValues.map_street_view = !1, gsValues.map_traffic = !1, gsValues.objects_visible = !0, gsValues.objects_follow = !1;
var la = [],
    map, mapMarkerIcons = new Array,
    mapLayers = new Array,
    objectsData = new Array,
    guiDragbars = new Array;
guiDragbars.objects = 180, guiDragbars.events = 180, guiDragbars.history = 180, guiDragbars.bottom_panel = 178;
var menuOnItem, timer_objectLoadData, isIE = eval("/*@cc_on!@*/!1"),
    utilsRulerData = new Array;
utilsRulerData.enabled = !1, utilsRulerData.line_layer, utilsRulerData.label_layer;
var utilsAreaData = new Array;
utilsAreaData.enabled = !1, utilsAreaData.area_layer;
var utilsRouteToPointData = new Array;
utilsRouteToPointData.route_points = !1;
var utilsFollowObjectData = new Array,
    utilsStreetViewData = new Array;
utilsStreetViewData.prev_lat = !1, utilsStreetViewData.prev_lng = !1;

//MODIFICACIONES

//Ocultar div, llamada con una funcion etiqueta de select y oculta div por name
// etiquieta de div style="visibility:hidden" id="diferencial_dinamico"

// function mostrarDivDos(nombre){

//     var opcionMarcado = document.getElementById('dialog_report_type').value;
//     var input = document.getElementById('dialog_report_speed_limit').value;

//     if(opcionMarcado == 'overspeed3P'){
//         // $("input[name='pass1']").prop('disabled',sino);
//         document.getElementById(nombre).style.visibility='visible';
//     }
//     else{
//         document.getElementById(nombre).style.visibility='hidden';

//     }

// }

$(document).ready(function()
{
$('#dialog_report_type').change(function ()
{
    var sino = $(this).val() == 'overspeed3P' ? true : false;
    var sino_e = $(this).val() == 'overspeed3P' ? false : true;

    $("input[name='limite_velocidad']").prop('disabled',sino);
    $("input[name='filtro_a']").prop('disabled',sino_e);
    $("input[name='cantidad_r']").prop('disabled',sino_e);
    $("input[name='filtro_u']").prop('disabled',sino_e);
    $("input[name='filtro_d']").prop('disabled',sino_e);
    // var sino = $(this).val() != 'overspeed3P' ? true : false;
    // $("input[name='filtro_u']").prop('disabled',sino);
//Cambiar color algun input
            
    var sinoa = $(this).val() == 'overspeed3H' ? true : false;
    var sinob = $(this).val() == 'overspeed3H' ? false : true;
    $("input[name='cantidadhoras']").prop('disabled',sinob);
    $("input[name='fechaenvio']").prop('disabled',sinob);
     
    $("input[name='diario']").prop('disabled',sinoa);
    $("input[name='semanal']").prop('disabled',sinoa);
    $("input[name='mensual']").prop('disabled',sinoa);

    
// //Validar lo que hay en el input y aplicar css
    // if (sino==false)
    // {
    //      $("input[name='limite_velocidad']").css("background-color","#FFFFFF");


    // } else {

    //      $("input[name='limite_velocidad']").css("background-color","#EDECECs");
    //      $("input[name='limite_velocidad']").val("");
    //      $("input[name='limite_velocidad']").val("");
    // }


});
});