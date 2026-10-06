param([int]$Hwnd)
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
 [DllImport("user32.dll")] public static extern IntPtr FindWindow(string lpClassName,string lpWindowName);
 [DllImport("user32.dll")] public static extern IntPtr FindWindowEx(IntPtr parent,IntPtr child,string cls,string name);
 [DllImport("user32.dll")] public static extern IntPtr SendMessageTimeout(IntPtr hWnd,uint Msg,IntPtr wParam,IntPtr lParam,uint flags,uint timeout,out IntPtr result);
 [DllImport("user32.dll")] public static extern IntPtr SetParent(IntPtr hWnd,IntPtr hWndNewParent);
 [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd,int nCmdShow);
}
"@
$prog = [Win32]::FindWindow("Progman",$null)
$result=[IntPtr]::Zero
[Win32]::SendMessageTimeout($prog,0x052C,[IntPtr]::Zero,[IntPtr]::Zero,0,1000,[ref]$result) | Out-Null
$worker=[Win32]::FindWindowEx([IntPtr]::Zero,[IntPtr]::Zero,"WorkerW",$null)
if($worker -eq [IntPtr]::Zero){ $worker=$prog }
[Win32]::SetParent([IntPtr]$Hwnd,$worker) | Out-Null
[Win32]::ShowWindow([IntPtr]$Hwnd,5) | Out-Null
